#!/usr/bin/env python3

from __future__ import annotations

import json
import re
import unicodedata
from collections import Counter, defaultdict
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
SKILLS_ROOT = ROOT / ".agent/skills"
CATALOG_PATH = SKILLS_ROOT / "external/SKILL_CATALOG_RAW.json"
POLICY_PATH = SKILLS_ROOT / "skill-shard-policy.json"
SHARD_DIR = SKILLS_ROOT / "shards"
REPORT_PATH = ROOT / "docs/skill-shards-report.md"


def strip_accents(text: str) -> str:
    normalized = unicodedata.normalize("NFKD", text)
    return "".join(ch for ch in normalized if not unicodedata.combining(ch))


def normalize(text: str) -> str:
    text = strip_accents(str(text).lower())
    return re.sub(r"\s+", " ", text).strip()


def tokenize(text: str) -> list[str]:
    return re.findall(r"[a-z0-9]+", normalize(text))


def load_json(path: Path, default: Any) -> Any:
    if not path.exists():
        return default
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        return default


def skill_text(skill: dict[str, Any]) -> str:
    parts = [
        skill.get("id", ""),
        skill.get("name", ""),
        skill.get("description_en", ""),
        skill.get("source", ""),
    ]
    return normalize(" ".join(str(part) for part in parts))


def classify_skill(
    skill: dict[str, Any], domains: dict[str, Any], default_domain: str
) -> set[str]:
    text = skill_text(skill)
    skill_id = normalize(skill.get("id", ""))
    tokens = set(tokenize(text))
    matched: set[str] = set()

    for domain, rules in domains.items():
        if domain == default_domain or not isinstance(rules, dict):
            continue

        keywords = {
            normalize(item)
            for item in rules.get("keywords", [])
            if isinstance(item, str)
        }
        id_patterns = [
            normalize(item)
            for item in rules.get("id_patterns", [])
            if isinstance(item, str)
        ]
        bonus_ids = {
            normalize(item)
            for item in rules.get("bonus_ids", [])
            if isinstance(item, str)
        }

        if skill_id in bonus_ids:
            matched.add(domain)
            continue

        keyword_match = (
            any(token in keywords for token in tokens) if keywords else False
        )
        pattern_match = any(pattern and pattern in skill_id for pattern in id_patterns)

        if keyword_match or pattern_match:
            matched.add(domain)

    if not matched:
        matched.add(default_domain)

    return matched


def write_json(path: Path, data: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(
        json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )


def build_report(
    total: int,
    shard_counts: dict[str, int],
    overlap_distribution: Counter[int],
    unassigned_count: int,
) -> str:
    lines = [
        "# Skill Shards Report",
        "",
        "## Overview",
        "",
        f"- Master skill count: `{total}`",
        f"- Domain shard count: `{len(shard_counts)}`",
        f"- Unassigned to non-general domains: `{unassigned_count}`",
        "",
        "## Shard Counts",
        "",
    ]

    for domain, count in sorted(shard_counts.items()):
        lines.append(f"- `{domain}`: `{count}`")

    lines.extend(["", "## Multi-Label Overlap", ""])
    for label_count, skill_count in sorted(overlap_distribution.items()):
        lines.append(f"- Skills in `{label_count}` domain(s): `{skill_count}`")

    return "\n".join(lines) + "\n"


def main() -> int:
    catalog = load_json(CATALOG_PATH, [])
    policy = load_json(POLICY_PATH, {})

    if not isinstance(catalog, list) or not catalog:
        print(f"ERROR: Catalog missing or invalid: {CATALOG_PATH}")
        return 1

    if not isinstance(policy, dict):
        print(f"ERROR: Policy missing or invalid: {POLICY_PATH}")
        return 1

    domains = policy.get("domains", {})
    if not isinstance(domains, dict) or not domains:
        print("ERROR: Policy 'domains' section is missing.")
        return 1

    default_domain = str(policy.get("default_domain", "general"))
    if default_domain not in domains:
        domains[default_domain] = {
            "keywords": [],
            "id_patterns": [],
            "bonus_ids": [],
            "related": [],
        }

    shards: dict[str, list[dict[str, Any]]] = {domain: [] for domain in domains.keys()}
    overlap_distribution: Counter[int] = Counter()
    unassigned_count = 0

    for raw_skill in catalog:
        if not isinstance(raw_skill, dict):
            continue
        matched_domains = classify_skill(raw_skill, domains, default_domain)
        if matched_domains == {default_domain}:
            unassigned_count += 1
        overlap_distribution[len(matched_domains)] += 1
        for domain in matched_domains:
            shards[domain].append(raw_skill)

    for domain, skills in shards.items():
        skills.sort(
            key=lambda s: (normalize(s.get("id", "")), normalize(s.get("source", "")))
        )
        write_json(SHARD_DIR / f"skill_{domain}.json", skills)

    shard_counts = {domain: len(skills) for domain, skills in shards.items()}
    report = build_report(
        total=len(catalog),
        shard_counts=shard_counts,
        overlap_distribution=overlap_distribution,
        unassigned_count=unassigned_count,
    )
    REPORT_PATH.parent.mkdir(parents=True, exist_ok=True)
    REPORT_PATH.write_text(report, encoding="utf-8")

    print(f"Shards written to: {SHARD_DIR}")
    for domain, count in sorted(shard_counts.items()):
        print(f"- {domain}: {count}")
    print(f"Report written: {REPORT_PATH}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
