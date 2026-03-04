#!/usr/bin/env python3

from __future__ import annotations

import argparse
import json
import re
import sys
from collections import Counter, defaultdict
from dataclasses import dataclass
from pathlib import Path
from typing import Any


TOTAL_RE = re.compile(r"\*\*Toplam Beceri Sayısı:\*\*\s*(\d+)")
ROW_RE = re.compile(
    r"^\| \[(?P<name>[^\]]+)\]\((?P<link>[^)]+)\) \| (?P<desc>.*?) \| (?P<source>[^|]+) \|$"
)


@dataclass
class SkillRow:
    line_no: int
    name: str
    link: str
    description: str
    source: str


def parse_catalog(
    catalog_path: Path,
) -> tuple[int | None, list[SkillRow], list[tuple[int, str]]]:
    declared_total: int | None = None
    rows: list[SkillRow] = []
    parse_errors: list[tuple[int, str]] = []

    for line_no, line in enumerate(
        catalog_path.read_text(encoding="utf-8").splitlines(), 1
    ):
        if declared_total is None:
            total_match = TOTAL_RE.search(line)
            if total_match:
                declared_total = int(total_match.group(1))

        if line.startswith("| ["):
            row_match = ROW_RE.match(line)
            if not row_match:
                parse_errors.append((line_no, line))
                continue
            rows.append(
                SkillRow(
                    line_no=line_no,
                    name=row_match.group("name").strip(),
                    link=row_match.group("link").strip(),
                    description=row_match.group("desc").strip(),
                    source=row_match.group("source").strip(),
                )
            )

    return declared_total, rows, parse_errors


def load_policy(policy_path: Path) -> dict[str, Any]:
    default_policy: dict[str, Any] = {
        "source_priority": [
            "awesome-claude-skills",
            "claude-code",
            "superpowers",
            "eski-skiller",
        ],
        "fail_on": {
            "malformed_rows": True,
            "declared_total_mismatch": True,
            "missing_links": True,
            "source_priority_violation": False,
        },
    }

    if not policy_path.exists():
        return default_policy

    try:
        loaded = json.loads(policy_path.read_text(encoding="utf-8"))
    except Exception:
        return default_policy

    if not isinstance(loaded, dict):
        return default_policy

    merged = dict(default_policy)
    merged.update(loaded)

    default_fail_on = default_policy["fail_on"]
    loaded_fail_on = loaded.get("fail_on", {})
    if isinstance(default_fail_on, dict) and isinstance(loaded_fail_on, dict):
        merged["fail_on"] = dict(default_fail_on)
        merged["fail_on"].update(loaded_fail_on)

    return merged


def grouped_missing_by_source(rows: list[SkillRow]) -> dict[str, list[SkillRow]]:
    grouped: dict[str, list[SkillRow]] = defaultdict(list)
    for row in rows:
        grouped[row.source].append(row)
    return dict(grouped)


def build_markdown_report(
    catalog_path: Path,
    declared_total: int | None,
    rows: list[SkillRow],
    parse_errors: list[tuple[int, str]],
    missing_links: list[SkillRow],
    duplicate_name_map: dict[str, list[SkillRow]],
    variant_map: dict[str, list[str]],
    order_violations: list[tuple[int, str, str]],
    source_priority_violations: dict[str, list[SkillRow]],
) -> str:
    by_source = Counter(r.source for r in rows)
    no_description_rows = [r for r in rows if r.description == "No description found."]
    described_count = len(rows) - len(no_description_rows)

    lines: list[str] = []
    lines.append("# Skill Catalog Validation Report")
    lines.append("")
    lines.append("## Overview")
    lines.append("")
    lines.append(f"- Catalog: `{catalog_path}`")
    lines.append(f"- Parsed rows: `{len(rows)}`")
    lines.append(
        f"- Declared total: `{declared_total if declared_total is not None else 'missing'}`"
    )
    lines.append(f"- Sources: `{dict(by_source)}`")
    lines.append("")

    lines.append("## Errors")
    lines.append("")
    lines.append(f"- Malformed rows: `{len(parse_errors)}`")
    lines.append(f"- Missing link targets: `{len(missing_links)}`")
    mismatch = declared_total is None or declared_total != len(rows)
    lines.append(f"- Declared total mismatch: `{'yes' if mismatch else 'no'}`")
    lines.append("")

    if missing_links:
        lines.append("### Missing Links")
        lines.append("")
        for source, source_rows in sorted(
            grouped_missing_by_source(missing_links).items()
        ):
            lines.append(f"- **{source}** ({len(source_rows)})")
            for row in source_rows:
                lines.append(f"  - line {row.line_no}: `{row.name}` -> `{row.link}`")
        lines.append("")

    lines.append("## Warnings")
    lines.append("")
    lines.append(f"- Duplicate skill names: `{len(duplicate_name_map)}`")
    lines.append(f"- Underscore/hyphen variants: `{len(variant_map)}`")
    lines.append(f"- Sort order violations: `{len(order_violations)}`")
    lines.append(
        f"- Missing descriptions: `{len(no_description_rows)}` ({(len(no_description_rows) / len(rows) * 100.0) if rows else 0.0:.1f}%)"
    )
    lines.append(f"- Source priority violations: `{len(source_priority_violations)}`")
    lines.append("")

    if source_priority_violations:
        lines.append("### Source Priority Violations")
        lines.append("")
        for name, duplicates in sorted(source_priority_violations.items())[:50]:
            refs = ", ".join(f"line {r.line_no} ({r.source})" for r in duplicates)
            lines.append(f"- `{name}`: {refs}")
        if len(source_priority_violations) > 50:
            lines.append(
                f"- ... and {len(source_priority_violations) - 50} more source-priority violations"
            )
        lines.append("")

    if variant_map:
        lines.append("### Variant Groups")
        lines.append("")
        for normalized, variants in sorted(variant_map.items())[:80]:
            lines.append(f"- `{normalized}`: {', '.join(f'`{v}`' for v in variants)}")
        if len(variant_map) > 80:
            lines.append(f"- ... and {len(variant_map) - 80} more variant groups")
        lines.append("")

    lines.append("## Stats")
    lines.append("")
    lines.append(f"- With description: `{described_count}`")
    lines.append(f"- Without description: `{len(no_description_rows)}`")
    lines.append(
        f"- Duplicate names (items): `{sum(len(v) for v in duplicate_name_map.values())}`"
    )

    return "\n".join(lines) + "\n"


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Validate .agent/skills/SKILL_CATALOG.md"
    )
    parser.add_argument(
        "--catalog",
        default=".agent/skills/SKILL_CATALOG.md",
        help="Path to SKILL_CATALOG.md",
    )
    parser.add_argument(
        "--policy",
        default=".agent/skills/skill-catalog-policy.json",
        help="Path to optional validation policy JSON",
    )
    parser.add_argument(
        "--report",
        default=None,
        help="Optional path to write markdown report",
    )
    args = parser.parse_args()

    catalog_path = Path(args.catalog)
    if not catalog_path.exists():
        print(f"ERROR: Catalog file not found: {catalog_path}")
        return 1

    declared_total, rows, parse_errors = parse_catalog(catalog_path)
    policy = load_policy(Path(args.policy))

    by_source = Counter(r.source for r in rows)
    no_description_rows = [r for r in rows if r.description == "No description found."]

    missing_links: list[SkillRow] = []
    for row in rows:
        link_path = row.link
        if link_path.startswith("./"):
            link_path = link_path[2:]
        target = catalog_path.parent / link_path
        if not target.exists():
            missing_links.append(row)

    duplicate_name_map: dict[str, list[SkillRow]] = defaultdict(list)
    for row in rows:
        duplicate_name_map[row.name].append(row)
    duplicate_name_map = {k: v for k, v in duplicate_name_map.items() if len(v) > 1}

    variant_sets: dict[str, set[str]] = defaultdict(set)
    for row in rows:
        variant_sets[row.name.replace("_", "-")].add(row.name)
    variant_map = {k: sorted(v) for k, v in variant_sets.items() if len(v) > 1}

    order_violations: list[tuple[int, str, str]] = []
    for idx in range(len(rows) - 1):
        if rows[idx].name.casefold() > rows[idx + 1].name.casefold():
            order_violations.append(
                (rows[idx + 1].line_no, rows[idx].name, rows[idx + 1].name)
            )

    total_mismatch = declared_total is None or declared_total != len(rows)

    source_priority_raw = policy.get("source_priority", [])
    source_priority = (
        source_priority_raw
        if isinstance(source_priority_raw, list)
        and all(isinstance(item, str) for item in source_priority_raw)
        else []
    )
    source_rank = {name: idx for idx, name in enumerate(source_priority)}

    source_priority_violations: dict[str, list[SkillRow]] = {}
    for name, dupes in duplicate_name_map.items():
        sorted_by_priority = sorted(
            dupes,
            key=lambda r: (
                source_rank.get(r.source, 9999),
                r.line_no,
            ),
        )
        best_source = sorted_by_priority[0].source if sorted_by_priority else ""
        if dupes[0].source != best_source:
            source_priority_violations[name] = dupes

    fail_on_raw = policy.get("fail_on", {})
    fail_on = fail_on_raw if isinstance(fail_on_raw, dict) else {}
    fail_malformed = bool(fail_on.get("malformed_rows", True))
    fail_total = bool(fail_on.get("declared_total_mismatch", True))
    fail_missing_links = bool(fail_on.get("missing_links", True))
    fail_priority = bool(fail_on.get("source_priority_violation", False))

    error_count = 0
    warning_count = 0

    print("Overview")
    print(f"- catalog: {catalog_path}")
    print(f"- parsed rows: {len(rows)}")
    print(
        f"- declared total: {declared_total if declared_total is not None else 'missing'}"
    )
    print(f"- sources: {dict(by_source)}")
    print()

    print("Errors")
    if parse_errors:
        if fail_malformed:
            error_count += 1
        print(f"- malformed table rows: {len(parse_errors)}")
        for line_no, bad_line in parse_errors[:10]:
            print(f"  - line {line_no}: {bad_line[:140]}")
        if len(parse_errors) > 10:
            print(f"  - ... and {len(parse_errors) - 10} more")
    else:
        print("- malformed table rows: 0")

    if total_mismatch:
        if fail_total:
            error_count += 1
        if declared_total is None:
            print("- declared total: missing")
        else:
            print(
                f"- declared total mismatch: declared={declared_total}, parsed={len(rows)}"
            )
    else:
        print("- declared total mismatch: no")

    if missing_links:
        if fail_missing_links:
            error_count += 1
        print(f"- missing link targets: {len(missing_links)}")
        for row in missing_links[:10]:
            print(f"  - line {row.line_no}: {row.name} -> {row.link}")
        if len(missing_links) > 10:
            print(f"  - ... and {len(missing_links) - 10} more")
    else:
        print("- missing link targets: 0")
    print()

    print("Warnings")
    if duplicate_name_map:
        warning_count += 1
        print(f"- duplicate skill names: {len(duplicate_name_map)}")
        for name, duplicates in list(duplicate_name_map.items())[:10]:
            refs = ", ".join(f"line {r.line_no} ({r.source})" for r in duplicates)
            print(f"  - {name}: {refs}")
        if len(duplicate_name_map) > 10:
            print(f"  - ... and {len(duplicate_name_map) - 10} more")
    else:
        print("- duplicate skill names: 0")

    if variant_map:
        warning_count += 1
        print(f"- underscore/hyphen variants: {len(variant_map)}")
        for normalized, variants in list(variant_map.items())[:10]:
            print(f"  - {normalized}: {', '.join(variants)}")
        if len(variant_map) > 10:
            print(f"  - ... and {len(variant_map) - 10} more")
    else:
        print("- underscore/hyphen variants: 0")

    if no_description_rows:
        warning_count += 1
        no_desc_ratio = (len(no_description_rows) / len(rows) * 100.0) if rows else 0.0
        print(
            f"- missing descriptions: {len(no_description_rows)} ({no_desc_ratio:.1f}%)"
        )
    else:
        print("- missing descriptions: 0")

    if order_violations:
        warning_count += 1
        print(f"- sort order violations: {len(order_violations)}")
        for line_no, prev_name, next_name in order_violations[:10]:
            print(f"  - line {line_no}: '{prev_name}' comes before '{next_name}'")
    else:
        print("- sort order violations: 0")

    if source_priority_violations:
        if fail_priority:
            error_count += 1
        else:
            warning_count += 1
        print(f"- source priority violations: {len(source_priority_violations)}")
        for name, duplicates in list(source_priority_violations.items())[:10]:
            refs = ", ".join(f"line {r.line_no} ({r.source})" for r in duplicates)
            print(f"  - {name}: {refs}")
        if len(source_priority_violations) > 10:
            print(f"  - ... and {len(source_priority_violations) - 10} more")
    else:
        print("- source priority violations: 0")
    print()

    print("Stats")
    described_count = len(rows) - len(no_description_rows)
    described_ratio = (described_count / len(rows) * 100.0) if rows else 0.0
    print(f"- with description: {described_count} ({described_ratio:.1f}%)")
    print(f"- without description: {len(no_description_rows)}")
    print(
        f"- duplicate names (items): {sum(len(v) for v in duplicate_name_map.values())}"
    )
    print(f"- validation result: {'FAILED' if error_count else 'OK'}")

    if args.report:
        report_path = Path(args.report)
        report_path.parent.mkdir(parents=True, exist_ok=True)
        report = build_markdown_report(
            catalog_path=catalog_path,
            declared_total=declared_total,
            rows=rows,
            parse_errors=parse_errors,
            missing_links=missing_links,
            duplicate_name_map=duplicate_name_map,
            variant_map=variant_map,
            order_violations=order_violations,
            source_priority_violations=source_priority_violations,
        )
        report_path.write_text(report, encoding="utf-8")
        print(f"- report written: {report_path}")

    if error_count:
        print(
            f"\nValidation failed with {error_count} error group(s) and {warning_count} warning group(s)."
        )
        return 1

    print(f"\nValidation passed with {warning_count} warning group(s).")
    return 0


if __name__ == "__main__":
    sys.exit(main())
