# Skill Shards

Skill routing now supports domain-based shard files for faster and more targeted matching.

## Build Shards

```bash
npm run build:skills:shards
```

This command:

- Reads `.agent/skills/external/SKILL_CATALOG_RAW.json`
- Applies rules from `.agent/skills/skill-shard-policy.json`
- Writes shard files under `.agent/skills/shards/`
- Generates `docs/skill-shards-report.md`

## Shard Files

- `.agent/skills/shards/skill_frontend.json`
- `.agent/skills/shards/skill_backend.json`
- `.agent/skills/shards/skill_devops.json`
- `.agent/skills/shards/skill_security.json`
- `.agent/skills/shards/skill_testing.json`
- `.agent/skills/shards/skill_ai.json`
- `.agent/skills/shards/skill_automation.json`
- `.agent/skills/shards/skill_automation_crm.json`
- `.agent/skills/shards/skill_automation_marketing.json`
- `.agent/skills/shards/skill_automation_support.json`
- `.agent/skills/shards/skill_automation_finance.json`
- `.agent/skills/shards/skill_automation_data.json`
- `.agent/skills/shards/skill_general.json`

## Router Behavior

Router file: `.agent/skills/beceri-yonetimi/scripts/router.py`

Search flow:

1. Detect query domain(s)
2. Search primary shard(s)
3. If confidence is low, expand to related shard(s) + `general`
4. If still low, fallback to full master catalog

Confidence and fallback settings come from:

- `.agent/skills/skill-shard-policy.json`

## Notes

- Master catalog remains the source of truth.
- Shards are generated artifacts; rebuild after catalog updates.
