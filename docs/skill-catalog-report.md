# Skill Catalog Validation Report

## Overview

- Catalog: `.agent\skills\SKILL_CATALOG.md`
- Parsed rows: `1016`
- Declared total: `1016`
- Sources: `{'awesome-claude-skills': 941, 'claude-code': 13, 'eski-skiller': 48, 'superpowers': 14}`

## Errors

- Malformed rows: `0`
- Missing link targets: `27`
- Declared total mismatch: `no`

### Missing Links

- **claude-code** (13)
  - line 11: `Agent SDK Development Plugin` -> `./external/claude-code/agent-sdk-dev`
  - line 12: `Claude Opus 4.5 Migration Plugin` -> `./external/claude-code/claude-opus-4-5-migration`
  - line 13: `Code Review Plugin` -> `./external/claude-code/code-review`
  - line 14: `Commit Commands Plugin` -> `./external/claude-code/commit-commands`
  - line 16: `Explanatory Output Style Plugin` -> `./external/claude-code/explanatory-output-style`
  - line 17: `Feature Development Plugin` -> `./external/claude-code/feature-dev`
  - line 18: `Frontend Design Plugin` -> `./external/claude-code/frontend-design`
  - line 19: `Hookify Plugin` -> `./external/claude-code/hookify`
  - line 20: `Learning Style Plugin` -> `./external/claude-code/learning-output-style`
  - line 21: `PR Review Toolkit` -> `./external/claude-code/pr-review-toolkit`
  - line 22: `Plugin Development Toolkit` -> `./external/claude-code/plugin-dev`
  - line 23: `Ralph Wiggum Plugin` -> `./external/claude-code/ralph-wiggum`
  - line 800: `security-guidance` -> `./external/claude-code/security-guidance`
- **superpowers** (14)
  - line 153: `brainstorming` -> `./external/superpowers/brainstorming`
  - line 295: `dispatching-parallel-agents` -> `./external/superpowers/dispatching-parallel-agents`
  - line 356: `executing-plans` -> `./external/superpowers/executing-plans`
  - line 377: `finishing-a-development-branch` -> `./external/superpowers/finishing-a-development-branch`
  - line 752: `receiving-code-review` -> `./external/superpowers/receiving-code-review`
  - line 766: `requesting-code-review` -> `./external/superpowers/requesting-code-review`
  - line 874: `subagent-driven-development` -> `./external/superpowers/subagent-driven-development`
  - line 885: `systematic-debugging` -> `./external/superpowers/systematic-debugging`
  - line 904: `test-driven-development` -> `./external/superpowers/test-driven-development`
  - line 951: `using-git-worktrees` -> `./external/superpowers/using-git-worktrees`
  - line 952: `using-superpowers` -> `./external/superpowers/using-superpowers`
  - line 957: `verification-before-completion` -> `./external/superpowers/verification-before-completion`
  - line 993: `writing-plans` -> `./external/superpowers/writing-plans`
  - line 994: `writing-skills` -> `./external/superpowers/writing-skills`

## Warnings

- Duplicate skill names: `4`
- Underscore/hyphen variants: `26`
- Sort order violations: `2`
- Missing descriptions: `901` (88.7%)
- Source priority violations: `0`

### Variant Groups

- `anthropic-administrator-automation`: `anthropic-administrator-automation`, `anthropic_administrator-automation`
- `capsule-crm-automation`: `capsule-crm-automation`, `capsule_crm-automation`
- `docker-hub-automation`: `docker-hub-automation`, `docker_hub-automation`
- `fillout-forms-automation`: `fillout-forms-automation`, `fillout_forms-automation`
- `google-admin-automation`: `google-admin-automation`, `google_admin-automation`
- `google-classroom-automation`: `google-classroom-automation`, `google_classroom-automation`
- `google-maps-automation`: `google-maps-automation`, `google_maps-automation`
- `google-search-console-automation`: `google-search-console-automation`, `google_search_console-automation`
- `launch-darkly-automation`: `launch-darkly-automation`, `launch_darkly-automation`
- `lemon-squeezy-automation`: `lemon-squeezy-automation`, `lemon_squeezy-automation`
- `many-chat-automation`: `many-chat-automation`, `many_chat-automation`
- `microsoft-clarity-automation`: `microsoft-clarity-automation`, `microsoft_clarity-automation`
- `mistral-ai-automation`: `mistral-ai-automation`, `mistral_ai-automation`
- `new-relic-automation`: `new-relic-automation`, `new_relic-automation`
- `onesignal-rest-api-automation`: `onesignal-rest-api-automation`, `onesignal_rest_api-automation`
- `ring-central-automation`: `ring-central-automation`, `ring_central-automation`
- `share-point-automation`: `share-point-automation`, `share_point-automation`
- `similarweb-digitalrank-api-automation`: `similarweb-digitalrank-api-automation`, `similarweb_digitalrank_api-automation`
- `survey-monkey-automation`: `survey-monkey-automation`, `survey_monkey-automation`
- `wave-accounting-automation`: `wave-accounting-automation`, `wave_accounting-automation`
- `zoho-bigin-automation`: `zoho-bigin-automation`, `zoho_bigin-automation`
- `zoho-books-automation`: `zoho-books-automation`, `zoho_books-automation`
- `zoho-desk-automation`: `zoho-desk-automation`, `zoho_desk-automation`
- `zoho-inventory-automation`: `zoho-inventory-automation`, `zoho_inventory-automation`
- `zoho-invoice-automation`: `zoho-invoice-automation`, `zoho_invoice-automation`
- `zoho-mail-automation`: `zoho-mail-automation`, `zoho_mail-automation`

## Stats

- With description: `115`
- Without description: `901`
- Duplicate names (items): `8`
