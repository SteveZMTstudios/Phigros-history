#!/usr/bin/env python3
"""md_to_versions_json.py

Convert a Markdown version list (like `ver_data/VersionList_1.x.md`) into a JSON
file following the project's API spec (e.g., `api/v1/versions/1.json`).

Features:
- Remove/ignore HTML comments (<!-- ... -->) entirely.
- Extract version headings like `### 1.6.11 (50) 2021/07/25` -> versionName, versionCode, releaseDate.
- Extract changelog lines (ignore badge-only lines and commented content).
- Extract download links from markdown links (e.g., `[![TapTap]...](https://...)`), but DO NOT treat
  `img.shields.io` (or shields.io) image URLs as download endpoints.
- Normalize channel names (heuristic): lowercased, remove non-alphanumeric characters.

Usage:
    python scripts/md_to_versions_json.py --input ver_data/VersionList_1.x.md --output api/v1/versions/1.json

"""

from __future__ import annotations
import re
import json
import argparse
from collections import defaultdict
from urllib.parse import urlparse


# Helpers
RE_HEADING = re.compile(r'^\s*#{1,6}\s*(?P<version>v?\d+(?:\.\d+)*)(?:\s*\((?P<code>\d+)\))?(?:\s+(?P<date>\d{4}/\d{2}/\d{2}))?\s*$')
RE_NESTED_IMAGE_LINK = re.compile(r'\[!\[([^\]]*)\]\(([^)]+)\)\]\(([^)]+)\)')  # groups: alt, img_src, url
RE_MARKDOWN_LINK = re.compile(r'!\[([^\]]*)\]\(([^)]+)\)|\[([^\]]+)\]\(([^)]+)\)')
RE_HTML_COMMENT = re.compile(r'<!--(.*?)-->', re.S)
# remove entire <details>...</details> sections (ignore their content)
RE_DETAILS = re.compile(r'<details.*?>.*?</details>', re.S | re.I)
# HTML anchor with nested image: <a href="..."><img src="..."/></a>
RE_HTML_A_IMG = re.compile(r'<a[^>]+href=[\"\\\'](?P<href>[^\"\'\)]+)[\"\'\)][^>]*>\s*<img[^>]+src=[\"\'](?P<src>[^\"\']+)[\"\'][^>]*>\s*</a>', re.I)
# Generic HTML anchor
RE_HTML_A = re.compile(r'<a[^>]+href=[\"\\\'](?P<href>[^\"\'\)]+)[\"\'\)][^>]*>(?P<text>.*?)</a>', re.I | re.S)
# Generic img tag
RE_IMG_TAG = re.compile(r'<img[^>]+src=[\"\\\'](?P<src>[^\"\']+)[\"\'][^>]*>', re.I)

SHIELDS_DOMAINS = ("img.shields.io", "shields.io")


def remove_html_comments(text: str) -> str:
    """Remove HTML comments (<!-- ... -->) from text."""
    return RE_HTML_COMMENT.sub('', text)


def normalize_channel_name(text: str) -> str:
    key = re.sub(r'[^0-9a-zA-Z]+', '_', text.strip()).strip('_').lower()
    return key or 'unknown'


def guess_mirror_key_from_url(url: str) -> str:
    """Return a short key for a mirror based on URL or hostname."""
    try:
        p = urlparse(url)
        host = p.netloc.lower()
        # common shortcuts
        if 'github.com' in host:
            return 'github'
        if '123pan' in host or '123' in host:
            return '123'
        if 'huang1111' in host:
            return 'huang1111'
        if 'cloud.139' in host or 'caiyun' in host:
            return 'caiyun'
        # yun.139.com and related 139 domains should map to caiyun
        if '139.com' in host or 'yun.139' in host:
            return 'caiyun'
        if '1drv' in host or 'onedrive' in host:
            return 'onedrive'
        # else take the first part of hostname
        return host.split('.')[0]
    except Exception:
        return 'link'


def is_shield_url(url: str) -> bool:
    try:
        p = urlparse(url)
        return any(domain in p.netloc for domain in SHIELDS_DOMAINS)
    except Exception:
        return False


from html.parser import HTMLParser


class AnchorHTMLParser(HTMLParser):
    def __init__(self):
        super().__init__()
        # stack to handle nested tags and collect inner text per anchor
        self._anchor_stack: list[dict] = []
        self.links: list[tuple[str, str]] = []

    def handle_starttag(self, tag, attrs):
        tag = tag.lower()
        if tag == 'a':
            href = None
            title = None
            for k, v in attrs:
                if k.lower() == 'href':
                    href = v
                if k.lower() == 'title':
                    title = v
            # push a new anchor context
            self._anchor_stack.append({'href': href or '', 'title': title or '', 'text': ''})
        elif tag == 'img':
            # record image alt text to current anchor context if any
            alt = ''
            for k, v in attrs:
                if k.lower() == 'alt':
                    alt = v or ''
            if self._anchor_stack and alt:
                # append alt text to anchor's text so it can be used as label
                self._anchor_stack[-1]['text'] += (' ' + alt)

    def handle_data(self, data):
        if self._anchor_stack:
            self._anchor_stack[-1]['text'] += data

    def handle_endtag(self, tag):
        if tag.lower() == 'a' and self._anchor_stack:
            ctx = self._anchor_stack.pop()
            text = (ctx.get('text') or '').strip()
            title = (ctx.get('title') or '').strip()
            href = (ctx.get('href') or '').strip()
            label = text or title or ''
            if href:
                self.links.append((label, href))


def render_markdown_to_html(md_text):
    """Render Markdown to HTML. Prefer `markdown` package if available; otherwise use a minimal fallback that converts markdown links/images to anchors."""
    try:
        from markdown import markdown
        return markdown(md_text)
    except Exception:
        text = md_text
        # images -> anchors
        text = re.sub(r'!\[([^\]]*)\]\(([^)]+)\)', r'<a href="\2">\1</a>', text)
        # links -> anchors
        text = re.sub(r'\[([^\]]+)\]\(([^)]+)\)', r'<a href="\2">\1</a>', text)
        return text


def extract_links_from_html(html):
    parser = AnchorHTMLParser()
    parser.feed(html)
    return parser.links


class VersionBlock:
    def __init__(self, heading: str):
        self.heading = heading
        self.version = ''
        self.code = None
        self.date = None
        self.lines: list[str] = []
        self.download_links: list[tuple[str, str]] = []  # (label, url)

    def parse_heading(self):
        m = RE_HEADING.match(self.heading)
        if not m:
            return False
        self.version = m.group('version')
        if not self.version.startswith('v'):
            self.version = 'v' + self.version
        code = m.group('code')
        self.code = int(code) if code else None
        self.date = m.group('date')
        return True

    def add_line(self, line: str):
        self.lines.append(line.rstrip())

    def extract_links_from_lines(self):
        for ln in self.lines:
            # A) handle HTML anchors that wrap an <img> (e.g., <a href="..."><img src=...></a>)
            for m in RE_HTML_A_IMG.finditer(ln):
                href = (m.group('href') or '').strip()
                src = (m.group('src') or '').strip()
                if not href:
                    continue
                parsed = urlparse(href)
                if parsed.scheme not in ('http','https'):
                    continue
                if is_shield_url(href):
                    continue
                # try to get alt text from the img tag; if absent, use filename from src
                alt_m = re.search(r'alt=[\"\']([^\"\']+)[\"\']', m.group(0) or '', re.I)
                if alt_m:
                    label = alt_m.group(1).strip()
                else:
                    label = src.split('/')[-1]
                # if the image filename or src contains play/商店, prefer that as a hint
                if re.search(r'play|商店', (label + ' ' + src).lower()):
                    # make label explicitly indicate play so downstream heuristics pick it up
                    label = (label + ' Play').strip()
                self.download_links.append((label, href))

            # B) handle generic HTML anchors <a href="...">text</a>
            for m in RE_HTML_A.finditer(ln):
                href = (m.group('href') or '').strip()
                if not href:
                    continue
                parsed = urlparse(href)
                if parsed.scheme not in ('http','https'):
                    continue
                if is_shield_url(href):
                    continue
                # extract visible text if any (strip inner tags)
                inner = re.sub(r'<[^>]+>', '', m.group('text') or '').strip()
                self.download_links.append((inner, href))

            # C) handle nested image-inside-link markdown: [![alt](img)](url)
            for m in RE_NESTED_IMAGE_LINK.finditer(ln):
                alt = (m.group(1) or '').strip()
                img_src = (m.group(2) or '').strip()
                url = (m.group(3) or '').strip()
                # skip non-http links (anchors, local files)
                parsed = urlparse(url)
                if parsed.scheme not in ('http','https'):
                    continue
                if is_shield_url(url):
                    continue
                # prefer visible alt text; if alt doesn't indicate Play but image filename does, add Play hint
                label = alt or img_src.split('/')[-1]
                if re.search(r'play|商店', (label + ' ' + img_src).lower()):
                    label = (label + ' Play').strip()
                self.download_links.append((label, url.strip()))

            # D) handle normal markdown links and images
            for match in RE_MARKDOWN_LINK.finditer(ln):
                # match groups for image: group1(text) group2(url)
                # match groups for link: group3(text) group4(url)
                if match.group(2):
                    # image syntax: ![alt](imgurl) -> ignore images (unless outer link captured above)
                    url = match.group(2).strip()
                    if is_shield_url(url):
                        continue
                    continue
                else:
                    label = match.group(3) or ''
                    url = (match.group(4) or '').strip()
                    # skip anchors, fragments, local references and non-http(s) urls
                    if not url:
                        continue
                    parsed = urlparse(url)
                    if parsed.scheme not in ('http', 'https'):
                        # ignore internal anchors and local links like ./VersionList_2.x or #top
                        continue
                    if is_shield_url(url):
                        # links directly to shields (rare) - skip
                        continue
                    # record as potential download link
                    self.download_links.append((label.strip(), url.strip()))

        # Also render the entire markdown block to HTML and parse any anchors there.
        try:
            md_block = '\n'.join(self.lines)
            html = render_markdown_to_html(md_block)
            for title, href in extract_links_from_html(html):
                if not href:
                    continue
                parsed = urlparse(href)
                if parsed.scheme not in ('http', 'https'):
                    continue
                if is_shield_url(href):
                    continue
                # avoid duplicates
                if any(href == ex[1] for ex in self.download_links):
                    continue
                self.download_links.append(((title or '').strip(), href.strip()))
        except Exception:
            # be conservative: if HTML rendering fails, continue with previously found links
            pass

    def build_changelog(self) -> list[str]:
        changelog: list[str] = []
        for ln in self.lines:
            s = ln.strip()
            if not s:
                continue
            # skip lines that are only badge/link markup (after removing links)
            s_no_links = RE_MARKDOWN_LINK.sub('', s)
            s_no_links = re.sub(r'<[^>]+>', '', s_no_links).strip()
            if s_no_links == '':
                continue
            # remove markdown links entirely from changelog text
            s = RE_MARKDOWN_LINK.sub('', s)
            # remove leftover bracket(parenthesis) fragments like '](http://...)' or broken link parts
            s = re.sub(r'\]\s*\([^\)]*\)', '', s)
            s = re.sub(r'!\[[^\]]*\]', '', s)
            # remove inline references to shield SVG tokens or badge filenames (e.g., '下载-brightgreen.svg?logo=...')
            s = re.sub(r'\S*svg\?logo=\S*', '', s)
            # strip remaining HTML tags (e.g., <br>) and weird whitespace
            s = re.sub(r'<[^>]+>', '', s).strip()
            # remove leading bullets
            s = re.sub(r'^\s*[-*•]\s*', '', s)
            # final small cleanup: collapse multiple spaces
            s = re.sub(r'\s{2,}', ' ', s).strip()
            # skip lines that are only punctuation or separators (e.g., ")", "--", ")-->" etc.)
            if not s or re.match(r'^[\W_]+$', s):
                continue
            # skip lines that are just separators like '--' or '|'
            if re.match(r'^[\-|]{2,}$', s):
                continue
            changelog.append(s)
        return changelog


def parse_markdown_versions(md_text: str, debug: bool = False) -> dict:
    """Parse markdown and return JSON-friendly dict eg {'version': 'v1', 'details': [...]}"""
    text = remove_html_comments(md_text)
    # remove <details> blocks entirely (user requested: ignore their content)
    text = RE_DETAILS.sub('', text)
    lines = text.splitlines()

    blocks: list[VersionBlock] = []
    current: VersionBlock | None = None

    for ln in lines:
        # heading
        if RE_HEADING.match(ln):
            current = VersionBlock(ln)
            current.parse_heading()
            blocks.append(current)
            continue
        if current is None:
            continue
        current.add_line(ln)

    # process each block
    details = []
    for b in blocks:
        b.extract_links_from_lines()
        changelog = b.build_changelog()
        # Normalize to two channels only: 'taptap' and 'playstore'.
        # Heuristics:
        # - if label mentions 'play' -> playstore
        # - if any link in this version is an .obb file, then .obb/.apk links are grouped into playstore
        # - otherwise default to taptap
        downloads = {'taptap': {}, 'playstore': {}}

        # build temporary link objects with metadata
        link_objs = []
        md_block = '\n'.join(b.lines)

        def url_has_play_context(url: str) -> bool:
            """Return True if nearby markdown context suggests this link is a Play-store build."""
            try:
                lower_block = md_block.lower()
                idx = lower_block.find(url.lower())
                if idx >= 0:
                    start = max(0, idx - 80)
                    end = min(len(lower_block), idx + len(url) + 80)
                    ctx = lower_block[start:end]
                else:
                    ctx = lower_block
                return bool(re.search(r'play|play[_\s]?商店|play\s*版本|商店|google', ctx, re.I))
            except Exception:
                return False

        for label, url in b.download_links:
            lbl = (label or '').strip()
            u = (url or '').strip()
            if not u:
                continue
            parsed = urlparse(u)
            scheme = parsed.scheme.lower() if parsed.scheme else ''
            if scheme not in ('http', 'https'):
                continue
            is_apk = u.lower().endswith('.apk') or ('.apk' in parsed.path.lower())
            is_obb = '.obb' in u.lower() or 'obb' in lbl.lower()
            lower_lbl = lbl.lower()
            lower_u = u.lower()
            # label or URL hints that this is a Play Store build
            is_play_label = ('play' in lower_lbl) or ('play' in lower_u) or ('google' in lower_u) or ('play_商店' in lower_lbl)
            # also inspect nearby markdown context (fix cases where badge text says TapTap but context indicates Play)
            if url_has_play_context(u):
                is_play_label = True

            # derive mirror key: prefer URL-derived keys for known hosts (e.g., caiyun, huang1111)
            derived = guess_mirror_key_from_url(u)
            if derived and derived not in ('www', 'link'):
                mirror_key = derived
            else:
                m = re.search(r'([0-9A-Za-z_\-]{2,})', lbl)
                if m:
                    mirror_key = re.sub(r'[^0-9a-zA-Z]+', '', m.group(1)).lower()
                else:
                    mirror_key = derived or 'link'

            link_objs.append({'label': lbl, 'url': u, 'mirror': mirror_key, 'is_apk': is_apk, 'is_obb': is_obb, 'is_play_label': is_play_label, 'by_host': None})

        # determine if there are obb files in this version
        version_has_obb = any(x['is_obb'] for x in link_objs)

        for link in link_objs:
            # decide channel
            if link['is_play_label']:
                channel = 'playstore'
            elif version_has_obb and (link['is_apk'] or link['is_obb']):
                # apk + obb rule: these files belong to playstore
                channel = 'playstore'
            else:
                # default to taptap
                channel = 'taptap'

            downloads[channel].setdefault(link['mirror'], link['url'])

        # remove empty channels
        downloads = {k: v for k, v in downloads.items() if v}

        detail = {
            'versionName': b.version,
        }
        if b.code is not None:
            detail['versionCode'] = b.code
        if b.date:
            detail['releaseDate'] = b.date
        if changelog:
            detail['changelog'] = changelog
        if downloads:
            detail['downloads'] = downloads
        details.append(detail)

        if debug:
            print(f"Parsed {b.version}: code={b.code} date={b.date} changelog_len={len(changelog)} downloads={sum(len(v) for v in downloads.values())}")

    return {'version': 'v1', 'details': details}


def main():
    p = argparse.ArgumentParser()
    p.add_argument('--input', '-i', required=True, help='Input markdown file')
    p.add_argument('--output', '-o', required=True, help='Output JSON file')
    p.add_argument('--debug', '-d', action='store_true')
    args = p.parse_args()

    with open(args.input, 'r', encoding='utf-8') as f:
        md = f.read()

    data = parse_markdown_versions(md, debug=args.debug)

    with open(args.output, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    if args.debug:
        print(json.dumps(data, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    main()
