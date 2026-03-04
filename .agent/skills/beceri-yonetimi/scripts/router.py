#!/usr/bin/env python3

from __future__ import annotations

import json
import re
import sys
import unicodedata
from dataclasses import dataclass
from pathlib import Path
from typing import Any


stdout_reconfigure = getattr(sys.stdout, "reconfigure", None)
if callable(stdout_reconfigure):
    stdout_reconfigure(encoding="utf-8")


BASE_DIR = Path(__file__).resolve().parent
SKILLS_ROOT = BASE_DIR.parent.parent
CATALOG_PATH = SKILLS_ROOT / "external/SKILL_CATALOG_RAW.json"
SHARD_DIR = SKILLS_ROOT / "shards"
SHARD_POLICY_PATH = SKILLS_ROOT / "skill-shard-policy.json"


@dataclass
class ScoredSkill:
    score: float
    skill: dict[str, Any]
    reasons: list[str]


def strip_accents(text: str) -> str:
    normalized = unicodedata.normalize("NFKD", text)
    return "".join(ch for ch in normalized if not unicodedata.combining(ch))


def normalize(text: str) -> str:
    text = strip_accents(str(text).lower())
    return re.sub(r"\s+", " ", text).strip()


def tokenize(text: str) -> list[str]:
    tokens = re.findall(r"[a-z0-9]+", normalize(text))
    return [token for token in tokens if len(token) > 1]


def load_json(path: Path, default: Any) -> Any:
    if not path.exists():
        return default
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        return default


def default_policy() -> dict[str, Any]:
    return {
        "use_shards": True,
        "default_domain": "general",
        "source_priority": {
            "awesome-claude-skills": 4,
            "claude-code": 3,
            "superpowers": 2,
            "eski-skiller": 1,
        },
        "search": {
            "result_limit": 5,
            "professional_limit": 8,
            "fallback_score_threshold": 4.0,
            "min_results_before_fallback": 3,
        },
        "automation_trigger_tokens": [
            "automation",
            "otomasyon",
            "entegrasyon",
            "integration",
            "workflow",
            "zapier",
            "make",
            "n8n",
        ],
        "domains": {
            "automation": {
                "keywords": [
                    "automation",
                    "otomasyon",
                    "entegrasyon",
                    "integration",
                    "workflow",
                    "zapier",
                    "make",
                    "n8n",
                    "trigger",
                    "action",
                ],
                "id_patterns": ["automation", "workflow", "integration", "connector"],
                "bonus_ids": [
                    "connect-apps",
                    "composio-sdk",
                    "composio-search-automation",
                ],
                "related": [
                    "automation_crm",
                    "automation_marketing",
                    "automation_support",
                    "automation_finance",
                    "automation_data",
                    "ai",
                    "backend",
                    "devops",
                ],
            },
            "automation_crm": {
                "keywords": ["crm", "sales", "lead", "pipeline", "customer", "musteri"],
                "id_patterns": [
                    "crm",
                    "salesforce",
                    "hubspot",
                    "pipedrive",
                    "zoho",
                    "lead",
                    "customer",
                ],
                "bonus_ids": [
                    "hubspot-automation",
                    "zoho-crm-automation",
                    "salesforce-automation",
                ],
                "related": ["automation", "backend"],
            },
            "automation_marketing": {
                "keywords": ["marketing", "email", "campaign", "ads", "seo", "social"],
                "id_patterns": [
                    "mailchimp",
                    "campaign",
                    "sendgrid",
                    "ads",
                    "seo",
                    "social",
                    "klaviyo",
                ],
                "bonus_ids": [
                    "mailchimp-automation",
                    "google-search-console-automation",
                    "activecampaign-automation",
                ],
                "related": ["automation", "automation_data"],
            },
            "automation_support": {
                "keywords": [
                    "support",
                    "ticket",
                    "helpdesk",
                    "customer-service",
                    "chat",
                ],
                "id_patterns": [
                    "zendesk",
                    "freshdesk",
                    "intercom",
                    "helpdesk",
                    "ticket",
                    "support",
                ],
                "bonus_ids": [
                    "zendesk-automation",
                    "freshdesk-automation",
                    "intercom-automation",
                ],
                "related": ["automation", "automation_crm"],
            },
            "automation_finance": {
                "keywords": [
                    "finance",
                    "invoice",
                    "billing",
                    "accounting",
                    "payment",
                    "odeme",
                    "fatura",
                ],
                "id_patterns": [
                    "stripe",
                    "quickbooks",
                    "xero",
                    "invoice",
                    "billing",
                    "payment",
                    "accounting",
                ],
                "bonus_ids": [
                    "stripe-automation",
                    "quickbooks-automation",
                    "xero-automation",
                ],
                "related": ["automation", "backend"],
            },
            "automation_data": {
                "keywords": [
                    "analytics",
                    "data",
                    "etl",
                    "warehouse",
                    "bi",
                    "reporting",
                    "metrics",
                ],
                "id_patterns": [
                    "bigquery",
                    "snowflake",
                    "datadog",
                    "mixpanel",
                    "analytics",
                    "metabase",
                    "tableau",
                ],
                "bonus_ids": [
                    "mixpanel-automation",
                    "posthog-automation",
                    "google-analytics-automation",
                ],
                "related": ["automation", "backend", "devops"],
            },
            "frontend": {
                "keywords": [
                    "frontend",
                    "ui",
                    "ux",
                    "react",
                    "css",
                    "tailwind",
                    "figma",
                    "component",
                    "design",
                    "webapp",
                ],
                "id_patterns": ["frontend", "ui", "tailwind", "webapp"],
                "bonus_ids": ["frontend-design", "webapp-testing", "tailwind-patterns"],
                "related": ["testing"],
            },
            "backend": {
                "keywords": [
                    "backend",
                    "api",
                    "server",
                    "express",
                    "auth",
                    "jwt",
                    "database",
                    "query",
                    "orm",
                ],
                "id_patterns": ["api", "backend", "database", "auth"],
                "bonus_ids": ["api-patterns", "database-design", "architecture"],
                "related": ["security", "testing"],
            },
            "devops": {
                "keywords": [
                    "devops",
                    "deploy",
                    "deployment",
                    "docker",
                    "kubernetes",
                    "ci",
                    "cd",
                    "pipeline",
                    "release",
                ],
                "id_patterns": ["deploy", "docker", "kubernetes", "ci", "cd"],
                "bonus_ids": ["docker-expert", "deployment-procedures"],
                "related": ["backend", "security"],
            },
            "security": {
                "keywords": [
                    "security",
                    "guvenlik",
                    "guvenli",
                    "vulnerability",
                    "auth",
                    "permission",
                    "jwt",
                    "pentest",
                ],
                "id_patterns": ["security", "auth", "permission", "vulnerability"],
                "bonus_ids": ["security-guidance", "architecture-guardian"],
                "related": ["backend", "devops"],
            },
            "testing": {
                "keywords": [
                    "test",
                    "testing",
                    "e2e",
                    "unit",
                    "integration",
                    "debug",
                    "qa",
                ],
                "id_patterns": ["test", "debug", "qa"],
                "bonus_ids": ["webapp-testing", "systematic-debugging", "bug-hunter"],
                "related": ["frontend", "backend"],
            },
            "ai": {
                "keywords": [
                    "ai",
                    "llm",
                    "agent",
                    "prompt",
                    "mcp",
                    "model",
                ],
                "id_patterns": ["agent", "mcp", "prompt", "model"],
                "bonus_ids": ["mcp-builder", "agent-sdk-dev", "feature-dev"],
                "related": ["backend", "automation"],
            },
            "general": {
                "keywords": [],
                "id_patterns": [],
                "bonus_ids": [],
                "related": [],
            },
        },
    }


def deep_merge(base: dict[str, Any], override: dict[str, Any]) -> dict[str, Any]:
    merged = dict(base)
    for key, value in override.items():
        if key in merged and isinstance(merged[key], dict) and isinstance(value, dict):
            merged[key] = deep_merge(merged[key], value)
        else:
            merged[key] = value
    return merged


def load_policy() -> dict[str, Any]:
    loaded = load_json(SHARD_POLICY_PATH, {})
    if not isinstance(loaded, dict):
        loaded = {}
    return deep_merge(default_policy(), loaded)


def load_master_catalog() -> list[dict[str, Any]]:
    catalog = load_json(CATALOG_PATH, [])
    if not isinstance(catalog, list):
        return []
    return [item for item in catalog if isinstance(item, dict)]


def load_shard(domain: str) -> list[dict[str, Any]]:
    path = SHARD_DIR / f"skill_{domain}.json"
    data = load_json(path, [])
    if not isinstance(data, list):
        return []
    return [item for item in data if isinstance(item, dict)]


def detect_domains(query_tokens: list[str], policy: dict[str, Any]) -> set[str]:
    domains: set[str] = set()
    domain_rules = policy.get("domains", {})
    for domain, rules in domain_rules.items():
        if domain == "general" or not isinstance(rules, dict):
            continue
        keywords = {
            normalize(k) for k in rules.get("keywords", []) if isinstance(k, str)
        }
        if any(token in keywords for token in query_tokens):
            domains.add(domain)
    return domains


def build_search_text(skill: dict[str, Any]) -> str:
    fields = [
        skill.get("id", ""),
        skill.get("name", ""),
        skill.get("description_en", ""),
        skill.get("source", ""),
    ]
    return normalize(" ".join(str(value) for value in fields))


def dedupe_by_id(
    matches: list[ScoredSkill], source_priority: dict[str, int]
) -> list[ScoredSkill]:
    best: dict[str, ScoredSkill] = {}
    for item in matches:
        skill_id = normalize(item.skill.get("id", ""))
        current = best.get(skill_id)
        if current is None:
            best[skill_id] = item
            continue

        item_src_pr = source_priority.get(str(item.skill.get("source", "")), 0)
        cur_src_pr = source_priority.get(str(current.skill.get("source", "")), 0)
        if item.score > current.score or (
            abs(item.score - current.score) < 1e-6 and item_src_pr > cur_src_pr
        ):
            best[skill_id] = item

    return list(best.values())


def score_skill(
    skill: dict[str, Any],
    query: str,
    query_tokens: list[str],
    domains: set[str],
    policy: dict[str, Any],
) -> ScoredSkill:
    score = 0.0
    reasons: list[str] = []

    text = build_search_text(skill)
    skill_id = normalize(skill.get("id", ""))
    skill_name = normalize(skill.get("name", ""))
    desc = normalize(skill.get("description_en", ""))
    source = str(skill.get("source", ""))

    name_tokens = set(tokenize(skill_name))
    id_tokens = set(tokenize(skill_id.replace("-", " ").replace("_", " ")))
    desc_tokens = set(tokenize(desc))
    all_tokens = set(tokenize(text))

    if query and query in skill_name:
        score += 12.0
        reasons.append("tam ad eslesmesi")
    if query and query in skill_id:
        score += 10.0
        reasons.append("tam id eslesmesi")

    for token in query_tokens:
        if token in name_tokens:
            score += 3.0
        elif token in id_tokens:
            score += 2.6
        elif token in desc_tokens:
            score += 1.5
        elif token in all_tokens:
            score += 0.8

    source_priority = policy.get("source_priority", {})
    if isinstance(source_priority, dict):
        score += float(source_priority.get(source, 0)) * 0.25

    if desc and desc != "no description found.":
        score += 1.0
    else:
        score -= 0.4

    domain_rules = policy.get("domains", {})
    for domain in domains:
        rules = domain_rules.get(domain, {}) if isinstance(domain_rules, dict) else {}
        if not isinstance(rules, dict):
            continue
        bonus_ids = {
            normalize(item)
            for item in rules.get("bonus_ids", [])
            if isinstance(item, str)
        }
        if skill_id in bonus_ids:
            score += 3.0
            reasons.append(f"{domain} alani icin guclu skill")

    trigger_tokens = {
        normalize(token)
        for token in policy.get("automation_trigger_tokens", [])
        if isinstance(token, str)
    }
    if "automation" in skill_id and not set(query_tokens).intersection(trigger_tokens):
        score -= 1.5

    return ScoredSkill(score=score, skill=skill, reasons=reasons)


def search_catalog(
    query: str,
    catalog: list[dict[str, Any]],
    domains: set[str],
    policy: dict[str, Any],
    limit: int,
) -> list[ScoredSkill]:
    query_normalized = normalize(query)
    query_tokens = tokenize(query)

    scored = [
        score_skill(skill, query_normalized, query_tokens, domains, policy)
        for skill in catalog
    ]
    scored = [item for item in scored if item.score > 0.8]

    source_priority = policy.get("source_priority", {})
    if not isinstance(source_priority, dict):
        source_priority = {}
    scored = dedupe_by_id(scored, source_priority)

    scored.sort(
        key=lambda item: (
            item.score,
            source_priority.get(str(item.skill.get("source", "")), 0),
            normalize(item.skill.get("id", "")),
        ),
        reverse=True,
    )
    return scored[:limit]


def unique_domains(domains: list[str]) -> list[str]:
    seen: set[str] = set()
    ordered: list[str] = []
    for domain in domains:
        if domain not in seen:
            seen.add(domain)
            ordered.append(domain)
    return ordered


def collect_candidates(domains: list[str]) -> list[dict[str, Any]]:
    skills: list[dict[str, Any]] = []
    for domain in domains:
        skills.extend(load_shard(domain))
    return skills


def is_confident(results: list[ScoredSkill], policy: dict[str, Any]) -> bool:
    if not results:
        return False
    search_cfg = (
        policy.get("search", {}) if isinstance(policy.get("search", {}), dict) else {}
    )
    threshold = float(search_cfg.get("fallback_score_threshold", 4.0))
    min_results = int(search_cfg.get("min_results_before_fallback", 3))
    return len(results) >= min_results and results[0].score >= threshold


def route_search(
    query: str,
    policy: dict[str, Any],
    limit: int,
) -> tuple[list[ScoredSkill], dict[str, Any]]:
    master = load_master_catalog()
    if not master:
        return [], {"stage": "none", "domains": [], "source": "empty"}

    query_tokens = tokenize(query)
    detected = detect_domains(query_tokens, policy)

    default_domain = str(policy.get("default_domain", "general"))
    primary_domains = sorted(detected) if detected else [default_domain]

    if not bool(policy.get("use_shards", True)):
        results = search_catalog(query, master, set(primary_domains), policy, limit)
        return results, {
            "stage": "master",
            "domains": primary_domains,
            "source": "master",
        }

    stage1_domains = unique_domains(primary_domains)
    stage1_candidates = collect_candidates(stage1_domains)
    if stage1_candidates:
        stage1_results = search_catalog(
            query, stage1_candidates, set(primary_domains), policy, limit
        )
        if is_confident(stage1_results, policy):
            return stage1_results, {
                "stage": "shard-primary",
                "domains": stage1_domains,
                "source": "shards",
            }

    related: list[str] = []
    domain_rules = policy.get("domains", {})
    if isinstance(domain_rules, dict):
        for domain in primary_domains:
            rules = domain_rules.get(domain, {})
            if isinstance(rules, dict):
                related.extend(
                    [r for r in rules.get("related", []) if isinstance(r, str)]
                )

    stage2_domains = unique_domains(primary_domains + related + [default_domain])
    stage2_candidates = collect_candidates(stage2_domains)
    if stage2_candidates:
        stage2_results = search_catalog(
            query, stage2_candidates, set(primary_domains), policy, limit
        )
        if is_confident(stage2_results, policy):
            return stage2_results, {
                "stage": "shard-expanded",
                "domains": stage2_domains,
                "source": "shards",
            }

    stage3_results = search_catalog(query, master, set(primary_domains), policy, limit)
    return stage3_results, {
        "stage": "master-fallback",
        "domains": ["all"],
        "source": "master",
    }


def pick_professional_skills(
    matches: list[ScoredSkill],
    domains: set[str],
    policy: dict[str, Any],
    limit: int = 4,
) -> list[ScoredSkill]:
    selected: list[ScoredSkill] = []
    used_ids: set[str] = set()

    domain_rules = (
        policy.get("domains", {}) if isinstance(policy.get("domains", {}), dict) else {}
    )
    for domain in sorted(domains):
        rules = domain_rules.get(domain, {}) if isinstance(domain_rules, dict) else {}
        if not isinstance(rules, dict):
            continue
        bonus_ids = {
            normalize(item)
            for item in rules.get("bonus_ids", [])
            if isinstance(item, str)
        }
        if not bonus_ids:
            continue
        choice = next(
            (
                item
                for item in matches
                if normalize(item.skill.get("id", "")) in bonus_ids
                and normalize(item.skill.get("id", "")) not in used_ids
            ),
            None,
        )
        if choice:
            selected.append(choice)
            used_ids.add(normalize(choice.skill.get("id", "")))
        if len(selected) >= limit:
            return selected

    for item in matches:
        item_id = normalize(item.skill.get("id", ""))
        if item_id in used_ids:
            continue
        selected.append(item)
        used_ids.add(item_id)
        if len(selected) >= limit:
            break

    return selected


def build_professional_prompt(user_prompt: str, selected: list[ScoredSkill]) -> str:
    skill_lines: list[str] = []
    for idx, item in enumerate(selected, 1):
        skill = item.skill
        description = str(skill.get("description_en", "No description found."))
        reason = ", ".join(item.reasons) if item.reasons else "baglamsal eslesme"
        skill_lines.append(
            f"{idx}. {skill.get('name')} (id: {skill.get('id')}, kaynak: {skill.get('source')}) - neden: {reason} - aciklama: {description}"
        )

    if not skill_lines:
        skill_lines = [
            "1. Uygun skill bulunamadi; genel muhendislik en iyi pratikleri ile ilerle."
        ]

    lines = [
        "# Profesyonel Uygulama Promptu",
        "",
        "## Rol",
        "Sen uzman bir yazilim cozumleyicisi ve uygulama muhendisisin.",
        "",
        "## Kullanici Talebi",
        user_prompt,
        "",
        "## Secilen Skilller",
        *skill_lines,
        "",
        "## Uygulama Kurallari",
        "- Talebi once gereksinimlere bol.",
        "- Secilen skillleri oncelik sirasina gore kullan.",
        "- Belirsiz noktalarda guvenli varsayim yap ve varsayimi acikca belirt.",
        "- Kod, mimari, test ve guvenlik tarafinda en iyi pratikleri uygula.",
        "- Son ciktiyi uygulanabilir adimlar, dosya yollari ve dogrulama komutlari ile ver.",
        "",
        "## Cikti Formati",
        "1) Kisa plan",
        "2) Uygulama adimlari",
        "3) Riskler ve alternatifler",
        "4) Dogrulama (test/build/lint)",
    ]
    return "\n".join(lines)


def print_search_results(
    query: str, matches: list[ScoredSkill], route_info: dict[str, Any]
) -> None:
    if not matches:
        print("Eslesen beceri bulunamadi.")
        return

    stage = route_info.get("stage", "unknown")
    domains = route_info.get("domains", [])
    print(f"Routing: stage={stage}, domains={domains}")
    print(f"'{query}' icin en uygun skill sonuclari:\n")

    for item in matches:
        skill = item.skill
        desc = str(skill.get("description_en", "Aciklama yok."))
        reason = ", ".join(item.reasons) if item.reasons else "baglamsal eslesme"
        print(f"- {skill.get('name')} (ID: {skill.get('id')})")
        print(f"  skor: {item.score:.2f}")
        print(f"  neden: {reason}")
        print(f"  kaynak: {skill.get('source')} | yol: {skill.get('path')}")
        print(f"  aciklama: {desc[:160]}")
        print()


def print_help() -> None:
    print("Kullanim: python router.py [komut] [parametreler]")
    print("Komutlar:")
    print("  search [istek]          -> En uygun skillleri getir")
    print("  detail [skill_id]       -> Skill detayini getir")
    print(
        "  professional [istek]    -> Skill secimi + profesyonel uygulanabilir prompt uret"
    )


def main() -> None:
    if len(sys.argv) < 2:
        print_help()
        return

    command = normalize(sys.argv[1])
    policy = load_policy()

    search_cfg = (
        policy.get("search", {}) if isinstance(policy.get("search", {}), dict) else {}
    )
    default_limit = int(search_cfg.get("result_limit", 5))
    professional_limit = int(search_cfg.get("professional_limit", 8))

    if command == "search":
        query = " ".join(sys.argv[2:]).strip()
        if not query:
            print("Lutfen bir arama terimi girin.")
            return
        matches, route_info = route_search(query, policy, limit=default_limit)
        print_search_results(query, matches, route_info)
        return

    catalog = load_master_catalog()
    if not catalog:
        print(f"Hata: Katalog bulunamadi: {CATALOG_PATH}")
        return

    if command == "detail":
        if len(sys.argv) < 3:
            print("Lutfen bir skill_id girin.")
            return
        skill_id = normalize(sys.argv[2])
        skill = next(
            (item for item in catalog if normalize(item.get("id", "")) == skill_id),
            None,
        )
        if not skill:
            print("Beceri bulunamadi.")
            return

        print(f"# {skill.get('name')}")
        print(f"ID: {skill.get('id')}")
        print(f"Kaynak: {skill.get('source')}")
        print(f"Yol: {skill.get('path')}")
        print(f"\nAciklama:\n{skill.get('description_en', 'Aciklama yok.')}")
        return

    if command in {"professional", "profesyonel"}:
        user_prompt = " ".join(sys.argv[2:]).strip()
        if not user_prompt:
            print("Lutfen profesyonellestirilecek istegi girin.")
            return
        matches, route_info = route_search(
            user_prompt, policy, limit=professional_limit
        )
        domains = detect_domains(tokenize(user_prompt), policy)
        selected = pick_professional_skills(matches, domains, policy, limit=4)
        print_search_results(user_prompt, matches[:default_limit], route_info)
        print("---\n")
        print(build_professional_prompt(user_prompt, selected))
        return

    print("Bilinmeyen komut.")
    print_help()


if __name__ == "__main__":
    main()
