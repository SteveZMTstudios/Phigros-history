import os
import re
from datetime import datetime, timedelta, timezone

import requests
from bs4 import BeautifulSoup


URL = "https://www.taptap.cn/app/165287/all-info?platform=android"
DATE_SELECTOR = "#__nuxt > div > main > div > div.app__intro > div.app__intro__version > div > div:nth-child(1) > div.app__intro__version__header.font-bold > span.app__intro__version__time.gray-04"
VERSION_SELECTOR = "#__nuxt > div > main > div > div.app__intro > div.app__intro__version > div > div:nth-child(1) > div.app__intro__version__header.font-bold > span.app__intro__version__name.caption-m12-w12.primary-tap-blue"


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
    date_node = soup.select_one(DATE_SELECTOR)
    version_node = soup.select_one(VERSION_SELECTOR)

    if not date_node or not version_node:
        raise RuntimeError("未能从页面中提取版本号或发布时间。")

    release_date_text = date_node.get_text(strip=True)
    version_code = version_node.get_text(strip=True)

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