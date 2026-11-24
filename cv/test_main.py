# Copyright (c) 2026- Paschalis Bizopoulos
"""Check the public page controls and links."""

import os
from pathlib import Path

from bs4 import BeautifulSoup


def test_cv_links_to_the_sparsely_activated_networks_paper_code_and_demo() -> None:
    """Keep the three research outputs accessible together from the CV."""
    page = BeautifulSoup(Path(os.environ["PAGE"]).read_text(), "html.parser")
    paragraph = next(
        p for p in page.find_all("p") if "Sparsely Activated Networks" in p.get_text()
    )
    links = {a.get_text(strip=True): a.get("href") for a in paragraph.find_all("a")}
    expected = {
        "[pdf]": "https://arxiv.org/pdf/1907.06592.pdf",
        "[code]": "https://github.com/pbizopoulos/sparsely-activated-networks",
        "[web application]": "https://pbizopoulos.github.io/sparsely-activated-networks/",
    }
    if any(links.get(label) != url for label, url in expected.items()):
        raise AssertionError(links)
