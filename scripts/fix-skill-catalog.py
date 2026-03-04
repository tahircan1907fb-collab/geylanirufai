#!/usr/bin/env python3

from __future__ import annotations

import argparse
import difflib
import json
import re
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import Any


TOTAL_RE = re.compile(r"^(\*\*Toplam Beceri Sayısı:\*\*\s*)(\d+)(\s*)$")
ROW_RE = re.compile(
    r"^\| \[(?P<name>[^\]]+)\]\((?P<link>[^)]+)\) \| (?P<desc>.*?) \| (?P<source>[^|]+) \|$"
)


@dataclass
class ParsedRow:
    name: str
    link: str
    desc: str
    source: str
    raw_line: str


def parse_rows(lines: list[str]) -> tuple[list[int], list[ParsedRow]]:
    row_indexes: list[int] = []
    rows: list[ParsedRow] = []

    for idx, line in enumerate(lines):
        if not line.startswith("| ["):
            continue
        match = ROW_RE.match(line)
        if not match:
            continue
        row_indexes.append(idx)
        rows.append(
            ParsedRow(
                name=match.group("name").strip(),
                link=match.group("link").strip(),
                desc=match.group("desc").strip(),
                source=match.group("source").strip(),
                raw_line=line,
            )
        )

    return row_indexes, rows


def format_row(row: ParsedRow) -> str:
    return f"| [{row.name}]({row.link}) | {row.desc} | {row.source} |"


def update_declared_total(lines: list[str], total: int) -> list[str]:
    out = lines[:]
    for i, line in enumerate(out):
        match = TOTAL_RE.match(line)
        if not match:
            continue
        out[i] = f"{match.group(1)}{total}{match.group(3)}"
        break
    return out


def load_source_priority(policy_path: Path) -> dict[str, int]:
    if not policy_path.exists():
        return {}

    try:
        loaded: Any = json.loads(policy_path.read_text(encoding="utf-8"))
    except Exception:
        return {}

    if not isinstance(loaded, dict):
        return {}

    raw_priority = loaded.get("source_priority", [])
    if not isinstance(raw_priority, list):
        return {}
    if not all(isinstance(item, str) for item in raw_priority):
        return {}

    return {name: idx for idx, name in enumerate(raw_priority)}


def main() -> int:
    parser = argparse.ArgumentParser(description="Safe autofix for SKILL_CATALOG.md")
    parser.add_argument(
        "--catalog",
        default=".agent/skills/SKILL_CATALOG.md",
        help="Path to SKILL_CATALOG.md",
    )
    parser.add_argument(
        "--write",
        action="store_true",
        help="Write changes to file. Without this flag, only show diff.",
    )
    parser.add_argument(
        "--policy",
        default=".agent/skills/skill-catalog-policy.json",
        help="Path to optional validation policy JSON",
    )
    args = parser.parse_args()

    catalog_path = Path(args.catalog)
    if not catalog_path.exists():
        print(f"ERROR: Catalog file not found: {catalog_path}")
        return 1

    original_text = catalog_path.read_text(encoding="utf-8")
    original_lines = original_text.splitlines()

    row_indexes, rows = parse_rows(original_lines)
    if not row_indexes:
        print("No parsable catalog rows found; nothing to fix.")
        return 0

    source_rank = load_source_priority(Path(args.policy))

    sorted_rows = sorted(
        rows,
        key=lambda r: (
            r.name.casefold(),
            source_rank.get(r.source, 9999),
            r.source.casefold(),
            r.link.casefold(),
        ),
    )

    updated_lines = original_lines[:]
    for idx, row in zip(row_indexes, sorted_rows):
        updated_lines[idx] = format_row(row)

    updated_lines = update_declared_total(updated_lines, len(rows))
    updated_text = "\n".join(updated_lines)
    if original_text.endswith("\n"):
        updated_text += "\n"

    if updated_text == original_text:
        print("No changes needed.")
        return 0

    print("Proposed changes:")
    diff = difflib.unified_diff(
        original_text.splitlines(),
        updated_text.splitlines(),
        fromfile=str(catalog_path),
        tofile=str(catalog_path),
        lineterm="",
    )
    for line in diff:
        print(line)

    if not args.write:
        print("\nDry run only. Re-run with --write to apply changes.")
        return 0

    catalog_path.write_text(updated_text, encoding="utf-8")
    print("\nApplied changes.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
