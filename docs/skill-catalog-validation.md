# Skill Catalog Validation

This project includes a validator for `.agent/skills/SKILL_CATALOG.md`.

## Run

```bash
npm run validate:skills
npm run validate:skills:report
npm run fix:skills
```

- `validate:skills`: terminal validation output.
- `validate:skills:report`: validation output + markdown report at `docs/skill-catalog-report.md`.
- `fix:skills`: safe autofix in dry-run mode (shows diff only).

## What It Checks

- Table row format for each skill entry.
- `Toplam Beceri Sayisi` value against parsed row count.
- Whether each linked skill path exists on disk.
- Duplicate skill names.
- Name variants that only differ by `_` vs `-`.
- Missing descriptions (`No description found.`).
- Alphabetical sort-order violations.
- Duplicate-name source priority policy.

Policy file: `.agent/skills/skill-catalog-policy.json`

- `source_priority`: preferred source order for duplicate names.
- `fail_on`: which rule groups should fail CI (`true`) vs warn (`false`).

## Exit Codes

- `0`: No blocking errors.
- `1`: Blocking errors found (malformed rows, total mismatch, or missing link targets).

Warnings are reported but do not fail the command.

## Autofix Mode

`npm run fix:skills` does a dry run and prints a diff.

To apply changes:

```bash
python scripts/fix-skill-catalog.py --write
```

Current safe fixes:

- Re-sort skill rows alphabetically.
- Re-sync `Toplam Beceri Sayisi` with parsed row count.
