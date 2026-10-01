#!/usr/bin/env python3
"""Record a concise investor demo using Playwright and CDP screencasting."""

# ruff: noqa: CPY001, E501, S603, S607
import asyncio
import base64
import json
import logging
import os
import re
import shutil
import subprocess
import sys
import tempfile
import time
from collections.abc import Iterator
from contextlib import contextmanager
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Thread
from typing import Any, Literal

from playwright.async_api import CDPSession, Error, Page, async_playwright, expect

LOGGER = logging.getLogger(__name__)
WIDTH = 1600
HEIGHT = 1000
HOLD = 3


class QuietHandler(SimpleHTTPRequestHandler):
    """Serve the sibling application without request logging."""

    def log_message(self, _format: str, *args: object) -> None:
        """Suppress HTTP access logs."""


@contextmanager
def serve(directory: Path) -> Iterator[str]:
    """Bind an ephemeral localhost port and always release the server."""
    server = ThreadingHTTPServer(
        ("127.0.0.1", 0),
        partial(QuietHandler, directory=str(directory)),
    )
    thread = Thread(target=server.serve_forever, daemon=True)
    thread.start()
    try:
        yield f"http://127.0.0.1:{server.server_port}"
    finally:
        server.shutdown()
        server.server_close()
        thread.join()


class Screencast:
    """Acknowledge every CDP frame; retain timestamps instead of speeding up gaps."""

    def __init__(self, session: CDPSession, directory: Path) -> None:
        """Initialize the stream and its pending acknowledgements."""
        self.session = session
        self.directory = directory
        self.frames = []
        self.tasks = set()
        self.errors = []
        self.started = 0

    def receive(self, event: dict[str, Any]) -> None:
        """Persist a bounded-rate stream while acknowledging even discarded frames."""
        now = time.monotonic()
        try:
            if not self.frames or now - self.frames[-1][1] >= 1 / 15:
                name = f"frame-{len(self.frames):06d}.jpg"
                (self.directory / name).write_bytes(base64.b64decode(event["data"]))
                self.frames.append((name, now))
        except OSError as error:
            self.errors.append(error)
        task = asyncio.create_task(self.acknowledge(event["sessionId"]))
        self.tasks.add(task)
        task.add_done_callback(self.tasks.discard)

    async def acknowledge(self, session_id: int) -> None:
        """Do not let callback errors silently disappear."""
        try:
            await self.session.send(
                "Page.screencastFrameAck",
                {"sessionId": session_id},
            )
        except Error as error:
            self.errors.append(error)

    async def start(self, width: int, height: int) -> None:
        """Start Chromium's experimental Page screencast API via Playwright."""
        self.session.on("Page.screencastFrame", self.receive)
        self.started = time.monotonic()
        await self.session.send(
            "Page.startScreencast",
            {"format": "jpeg", "quality": 85, "maxWidth": width, "maxHeight": height},
        )

    async def stop(self) -> Path:
        """Finish delivery before constructing the variable-duration frame list."""
        await self.session.send("Page.stopScreencast")
        self.session.remove_listener("Page.screencastFrame", self.receive)
        if self.tasks:
            await asyncio.gather(*self.tasks)
        ended = time.monotonic()
        if self.errors:
            msg = "Screencast frame delivery failed"
            raise RuntimeError(msg) from self.errors[0]
        if not self.frames:
            msg = "Chromium delivered no screencast frames"
            raise RuntimeError(msg)
        lines = ["ffconcat version 1.0"]
        for index, (name, stamp) in enumerate(self.frames):
            following = (
                self.frames[index + 1][1] if index + 1 < len(self.frames) else ended
            )
            start = self.started if index == 0 else stamp
            lines.extend([f"file '{name}'", f"duration {following - start:.6f}"])
        lines.append(f"file '{self.frames[-1][0]}'")
        manifest = self.directory / "frames.ffconcat"
        manifest.write_text("\n".join(lines) + "\n")
        return manifest


class Tour:
    """Drive real UI interactions and record a chapter index."""

    def __init__(self, page: Page, hold: float, recording: Screencast) -> None:
        """Keep the browser and recording clock together."""
        self.page = page
        self.hold = hold
        self.recording = recording
        self.chapters = []
        self.shared_url = ""

    async def caption(self, title: str, detail: str) -> None:
        """Put readable chapter text below the app, including fullscreen views."""
        self.chapters.append(
            {
                "seconds": round(time.monotonic() - self.recording.started, 3),
                "title": title,
                "description": detail,
            },
        )
        LOGGER.info("%s", title)
        await self.page.evaluate(
            """([title, detail]) => {
                let panel = document.getElementById('video-caption');
                if (!panel) {
                    panel = document.createElement('aside');
                    panel.id = 'video-caption';
                    panel.style.cssText = 'position:fixed;bottom:0;left:0;right:0;'
                        + 'height:88px;box-sizing:border-box;padding:14px 28px;'
                        + 'background:#10232f;color:white;z-index:2147483647;'
                        + 'font:18px/1.5 system-ui;pointer-events:none';
                    document.body.append(panel);
                    document.querySelector('.app-shell').style.height = 'calc(100vh - 88px)';
                    document.addEventListener('fullscreenchange', () => {
                        (document.fullscreenElement || document.body).append(panel);
                    });
                }
                panel.replaceChildren();
                const heading = document.createElement('strong');
                heading.textContent = title;
                const description = document.createElement('div');
                description.textContent = detail;
                panel.append(heading, description);
            }""",
            [title, detail],
        )
        await self.pause(0.5)

    async def pause(self, factor: float = 1) -> None:
        """Pause at the selected viewing pace, without altering encoded time."""
        await self.page.wait_for_timeout(self.hold * factor * 1000)

    async def compiled(self) -> None:
        """Wait for a completed compilation."""
        await expect(self.page.locator("#editorState")).to_have_text(
            re.compile("DESIGN UPDATED|CHECK PLACEMENT"),
        )

    async def example(self, name: str) -> None:
        """Choose a bundled scene through the example selector."""
        await self.page.locator("#exampleSelect").select_option(label=name)
        await self.compiled()

    async def edit(self, source: str, *, error: bool = False) -> None:
        """Replace the program and verify its compile result."""
        editor = self.page.locator(".cm-content")
        await editor.fill(source)
        await editor.press("Control+Enter")
        if error:
            await expect(self.page.locator("#editorState")).to_have_text(
                "NEEDS ATTENTION",
            )
        else:
            await self.compiled()
        await self.pause()

    async def click(self, identifier: str) -> None:
        """Activate a control and leave time to inspect the result."""
        await self.page.locator(f"#{identifier}").click()
        await self.pause()

    async def drag(
        self,
        dx: float,
        dy: float,
        button: Literal["left", "right"] = "left",
    ) -> None:
        """Move the pointer gradually to make camera motion readable."""
        box = await self.page.locator("#viewport canvas").bounding_box()
        x, y = box["x"] + box["width"] * 0.55, box["y"] + box["height"] * 0.55
        await self.page.mouse.move(x, y)
        await self.page.mouse.down(button=button)
        for step in range(1, 31):
            await self.page.mouse.move(x + dx * step / 30, y + dy * step / 30)
            await self.page.wait_for_timeout(25)
        await self.page.mouse.up(button=button)
        await self.pause()

    async def run(self) -> None:
        """Tell one product story: create, inspect, scale, and share."""
        await self.caption(
            "Design your space",
            "Plan rooms, arrange furniture, and explore your design in 3D.",
        )
        await self.pause()
        await self.drag(110, 25)
        await self.caption(
            "Change the space in seconds",
            "Edit the layout and see the result immediately.",
        )
        source = (
            "# A shared workspace\nGRID 1\nROOM studio 8x7 AT 0,0\n"
            "WALLS north west\nWINDOWS north\nSTYLE neutral\n"
            "LAYOUT studio\n"
            ". | . | . | . | . | . | . | .\n"
            ". | desk(work_on_top)~north | . | . | . | plant | . | .\n"
            ". | . | . | . | . | . | . | .\n"
            ". | chair@180 | . | . | . | . | . | .\nEND\n"
            "LAYOUT work\nbook | monitor | mug\nEND"
        )
        await self.edit(source)
        await self.page.locator(".cm-content").fill(
            source.replace("STYLE neutral", "STYLE blue").replace(
                ". | chair@180 | . | . | . | . | . | .",
                ". | chair@180 | . | . | sofa | . | . | .",
            ),
        )
        await self.compiled()
        await self.pause(1.5)
        await self.caption(
            "Inspect from any angle",
            "See how furniture fits with a clear view of the floor plan.",
        )
        await self.click("topButton")
        await self.click("wallsButton")
        await self.caption(
            "From one room to a whole building",
            "Explore connected floors and focus on the spaces that matter.",
        )
        await self.example("Three-storey townhouse")
        await self.pause()
        await self.page.locator("#floorFocus").select_option(value="1")
        await self.pause(1.5)
        await self.page.locator("#wallsButton").click()
        await self.click("resetButton")
        await self.caption(
            "Share the exact design",
            "Copy one link to reopen the complete editable scene.",
        )
        await self.example("City apartment + balcony")
        await self.page.locator("#shareButton").click()
        await expect(self.page.locator("#message")).to_contain_text("Share URL copied")
        self.shared_url = await self.page.evaluate("navigator.clipboard.readText()")
        await self.pause()
        await self.caption(
            "Create. Explore. Share.",
            "Interior Design Editor",
        )
        await self.drag(85, 15)

    async def verify_share(self) -> None:
        """Check the recipient experience after capture to avoid recorded loading time."""
        shared_source = await self.page.evaluate(
            "url => new URLSearchParams(new URL(url).hash.slice(1)).get('scene')",
            self.shared_url,
        )
        recipient = await self.page.context.new_page()
        try:
            await recipient.goto(self.shared_url, wait_until="networkidle")
            await expect(recipient.locator("#editorState")).to_have_text(
                re.compile("DESIGN UPDATED|CHECK PLACEMENT"),
                timeout=90000,
            )
            await recipient.locator("#copyButton").click()
            await expect(recipient.locator("#message")).to_have_text("Layout copied")
            restored = await recipient.evaluate("navigator.clipboard.readText()")
            if restored != shared_source:
                message = "The shared scene did not preserve the complete program"
                raise RuntimeError(message)
            await expect(recipient.locator("#exampleSelect")).to_have_value("custom")
        finally:
            await recipient.close()


def default_output(directory: Path) -> Path:
    """Locate the package's runtime directory from anywhere within its flake."""
    for root in (directory, *directory.parents):
        package = root / "packages" / "interior-design-editor-video"
        if (root / "flake.nix").is_file() and (package / "default.nix").is_file():
            return package / "tmp" / "walkthrough.mp4"
    message = "run from within the Interior Design Editor flake"
    raise ValueError(message)


async def record(
    url: str,
    directory: Path,
) -> tuple[Path, list[dict[str, Any]]]:
    """Launch, capture, and close resources even when a tour assertion fails."""
    async with async_playwright() as playwright:
        browser_env = dict(os.environ)
        browser_env.pop("WAYLAND_DISPLAY", None)
        browser_args = ["--enable-gpu"]
        if sys.platform == "linux":
            browser_args += [
                "--use-angle=vulkan",
                "--enable-features=Vulkan",
                "--disable-vulkan-surface",
            ]
        browser = await playwright.chromium.launch(
            channel="chromium",
            env=browser_env,
            headless=True,
            args=browser_args,
        )
        try:
            context = await browser.new_context(
                viewport={"width": WIDTH, "height": HEIGHT},
                permissions=["clipboard-read", "clipboard-write"],
                device_scale_factor=1,
            )
            page = await context.new_page()
            page.on(
                "requestfailed",
                lambda request: LOGGER.error(
                    "Request failed: %s %s",
                    request.url,
                    request.failure,
                ),
            )
            page.on("pageerror", lambda error: LOGGER.error("Browser: %s", error))
            page.set_default_timeout(30000)
            await page.goto(url, wait_until="networkidle")
            await expect(page.locator("#editorState")).to_have_text(
                re.compile("DESIGN UPDATED|CHECK PLACEMENT"),
                timeout=90000,
            )
            session = await context.new_cdp_session(page)
            recording = Screencast(session, directory)
            await recording.start(WIDTH, HEIGHT)
            tour = Tour(page, HOLD, recording)
            try:
                await tour.run()
            finally:
                manifest = await recording.stop()
            await tour.verify_share()
            return manifest, tour.chapters
        finally:
            await browser.close()


def main() -> None:
    """Record the investor story, then encode a real-time MP4 and chapter JSON."""
    logging.basicConfig(level=logging.INFO, format="%(message)s")
    site = Path(
        os.environ.get(
            "INTERIOR_DESIGN_EDITOR_SITE",
            Path(__file__).resolve().parent.parent / "interior-design-editor",
        ),
    )
    output = default_output(Path.cwd()).resolve()
    chapters_path = output.with_suffix(".chapters.json")
    if output.exists() or chapters_path.exists():
        message = (
            "output or chapter file already exists; move or remove it before recording"
        )
        raise FileExistsError(message)
    if not (site / "index.html").is_file():
        message = f"no index.html in {site}"
        raise FileNotFoundError(message)
    if not shutil.which("ffmpeg"):
        message = "ffmpeg is required"
        raise RuntimeError(message)
    output.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(
        prefix="screencast-",
        dir=output.parent,
    ) as temporary:
        directory = Path(temporary)
        with serve(site) as url:
            manifest, chapters = asyncio.run(record(url, directory))
        subprocess.run(
            [
                "ffmpeg",
                "-hide_banner",
                "-loglevel",
                "warning",
                "-n",
                "-f",
                "concat",
                "-safe",
                "1",
                "-i",
                str(manifest),
                "-vf",
                "fps=30",
                "-c:v",
                "libx264",
                "-preset",
                "fast",
                "-crf",
                "20",
                "-pix_fmt",
                "yuv420p",
                "-movflags",
                "+faststart",
                str(output),
            ],
            check=True,
        )
    probe = subprocess.run(
        [
            "ffprobe",
            "-v",
            "error",
            "-select_streams",
            "v:0",
            "-show_entries",
            "stream=width,height,duration",
            "-of",
            "json",
            str(output),
        ],
        capture_output=True,
        text=True,
        check=True,
    )
    stream = json.loads(probe.stdout)["streams"][0]
    if (stream["width"], stream["height"]) != (WIDTH, HEIGHT) or float(
        stream["duration"],
    ) < chapters[-1]["seconds"]:
        message = f"Encoded video failed dimension/duration verification: {stream}"
        raise RuntimeError(message)
    chapters_path.write_text(json.dumps(chapters, indent=2) + "\n")
    LOGGER.info("Saved %s\nChapters: %s", output, chapters_path)


if __name__ == "__main__":
    main()
