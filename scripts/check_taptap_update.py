import os
import re
from datetime import datetime, timedelta, timezone

import requests
from bs4 import BeautifulSoup


URL = "https://www.taptap.cn/app/165287/all-info?platform=android"
VERSION_SELECTORS = [
    ".app__intro__version__item .app__intro__version__name",
    ".app__intro__version__name",
    "[class*='app__intro__version__name']",
]
DATE_SELECTORS = [
    ".app__intro__version__item .app__intro__version__time",
    ".app__intro__version__time",
    "[class*='app__intro__version__time']",
]


def set_output(key: str, value: str) -> None:
    output_file = os.getenv("GITHUB_OUTPUT")
    if output_file:
        with open(output_file, "a", encoding="utf-8") as file:
            file.write(f"{key}={value}\n")


def main() -> int:
    response = requests.get(
        URL,
        timeout=20,
        headers={"User-Agent": "Mozilla/5.0"},
    )
    response.raise_for_status()

    soup = BeautifulSoup(response.text, "html.parser")

    version_node = None
    for selector in VERSION_SELECTORS:
        version_node = soup.select_one(selector)
        if version_node:
            break

    date_node = None
    for selector in DATE_SELECTORS:
        date_node = soup.select_one(selector)
        if date_node:
            break

    if version_node and date_node:
        version_code = version_node.get_text(strip=True)
        release_date_text = date_node.get_text(strip=True)
    else:
        meta_desc = (
            soup.find("meta", attrs={"name": "description"})
            or soup.find("meta", attrs={"property": "og:description"})
            or soup.find("meta", attrs={"name": "twitter:description"})
        )
        if meta_desc and meta_desc.get("content"):
            match = re.search(
                r"Phigros\s*([\d\.]+(?:\s*\(\d+\))?)\D*?(\d{4}[/-]\d{2}[/-]\d{2})",
                meta_desc["content"],
            )
            if match:
                version_code = match.group(1).strip()
                release_date_text = match.group(2).strip()
            else:
                raise RuntimeError("未能从页面或元数据中提取版本号或发布时间。")
        else:
            raise RuntimeError("未能从页面中提取版本号或发布时间。")

    release_date_text = release_date_text.replace("-", "/")
    if not re.fullmatch(r"\d{4}/\d{2}/\d{2}", release_date_text):
        raise ValueError(f"日期格式不符合预期: {release_date_text}")

    release_date = datetime.strptime(release_date_text, "%Y/%m/%d").date()
    utc8_today = datetime.now(timezone(timedelta(hours=8))).date()
    days_diff = abs((utc8_today - release_date).days)
    should_create = days_diff <= 1

    print(f"latest_version={version_code}")
    print(f"release_date={release_date_text}")
    print(f"utc8_date={utc8_today.isoformat()}")
    print(f"days_diff={days_diff}")
    print(f"should_create_issue={str(should_create).lower()}")

    set_output("should_create", str(should_create).lower())
    set_output("version_code", version_code)
    set_output("release_date", release_date_text)

    return 0


if __name__ == "__main__":
    raise SystemExit(main())