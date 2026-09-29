"""Check screencast timing, acknowledgements, and local serving."""

# ruff: noqa: CPY001, ANN, D102, D103, PLR2004, S101, SLF001
import asyncio
import base64
import unittest
from importlib import import_module
from pathlib import Path
from tempfile import TemporaryDirectory
from unittest.mock import AsyncMock, patch
from urllib.request import urlopen

import pytest
from playwright.async_api import Error

main = import_module("packages.interior-design-editor-video.main")
Screencast = main.Screencast
serve = main.serve


class OutputPathTests(unittest.TestCase):
    """Keep default runtime output inside the owning package."""

    def test_default_from_root_package_and_descendant(self) -> None:
        """Resolve all launch locations to the same package tmp directory."""
        with TemporaryDirectory() as directory:
            root = Path(directory)
            package = root / "packages" / "interior-design-editor-video"
            package.mkdir(parents=True)
            (root / "flake.nix").touch()
            (package / "default.nix").touch()
            for cwd in (root, package, package / "tmp"):
                assert main.default_output(cwd) == package / "tmp" / "walkthrough.mp4"  # noqa: S101
            assert not (package / "packages").exists()  # noqa: S101

    def test_outside_flake_requires_explicit_output(self) -> None:
        """Avoid guessing a persistent directory outside the repository."""
        with (
            TemporaryDirectory() as directory,
            pytest.raises(ValueError, match="specify --output"),
        ):
            main.default_output(Path(directory))

    def test_explicit_output_remains_relative_to_caller(self) -> None:
        """Honor a supplied destination without applying default discovery."""
        assert main.parser().parse_args(["--output", "demo.mp4"]).output == Path(  # noqa: S101
            "demo.mp4",
        )


class RecordingTests(unittest.IsolatedAsyncioTestCase):
    """Exercise frame delivery without needing a GPU or external CDN."""

    async def test_dropped_frames_are_acknowledged_and_pauses_preserved(self) -> None:
        """Retain wall time and acknowledge even frames excluded by sampling."""
        session = AsyncMock()
        session.remove_listener = lambda *_: None
        with TemporaryDirectory() as directory:
            cast = Screencast(session, Path(directory))
            cast.started = 10
            event = {"data": base64.b64encode(b"jpeg").decode(), "sessionId": 1}
            with patch.object(main, "time") as clock:
                clock.monotonic.side_effect = [10.2, 10.21, 15.2, 20]
                cast.receive(event)
                cast.receive({**event, "sessionId": 2})
                cast.receive({**event, "sessionId": 3})
                await asyncio.sleep(0)
                manifest = await cast.stop()
            text = manifest.read_text()
            assert len(cast.frames) == 2  # noqa: S101, PLR2004
            assert "duration 5.200000" in text  # noqa: S101
            assert "duration 4.800000" in text  # noqa: S101
            assert text.count("file 'frame-000001.jpg'") == 2  # noqa: S101, PLR2004
            acknowledgements = [
                call.args[1]["sessionId"]
                for call in session.send.call_args_list
                if call.args[0] == "Page.screencastFrameAck"
            ]
            assert acknowledgements == [1, 2, 3]  # noqa: S101

    async def test_empty_recording_fails(self) -> None:
        """Reject an empty stream instead of creating an empty video."""
        session = AsyncMock()
        session.remove_listener = lambda *_: None
        with TemporaryDirectory() as directory:
            cast = Screencast(session, Path(directory))
            with pytest.raises(RuntimeError, match="no screencast frames"):
                await cast.stop()

    async def test_acknowledgement_failure_is_reported(self) -> None:
        """Surface callback errors when stopping the recording."""
        session = AsyncMock()
        session.remove_listener = lambda *_: None
        with TemporaryDirectory() as directory:
            cast = Screencast(session, Path(directory))
            session.send.side_effect = Error("disconnected")
            await cast.acknowledge(1)
            session.send.side_effect = None
            with pytest.raises(RuntimeError, match="delivery failed"):
                await cast.stop()


class ServerTests(unittest.TestCase):
    """Check that the supplied site is served from the chosen directory."""

    def test_serves_site(self) -> None:
        """Serve the requested directory from an ephemeral loopback port."""
        with TemporaryDirectory() as directory:
            Path(directory, "index.html").write_text("Interior Design Editor")
            with serve(Path(directory)) as url, urlopen(url, timeout=5) as response:  # noqa: S310
                assert response.read() == b"Interior Design Editor"  # noqa: S101


if __name__ == "__main__":
    unittest.main()
