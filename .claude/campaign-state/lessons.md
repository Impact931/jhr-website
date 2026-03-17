# SEO/GEO Engine — Lessons Learned

This file is the engine's persistent memory. Every correction, every failed assumption, every unexpected result becomes a rule here. The engine reads this file at the start of every cycle and applies these lessons to avoid repeating mistakes.

**Format**: Each lesson includes what triggered it, the rule to follow, severity, and which phase it applies to.

---

## How to Add a Lesson

```markdown
### [DATE] — [SHORT TITLE]
**Trigger**: [What the user corrected or what went wrong]
**Rule**: [The rule to prevent this mistake]
**Severity**: [CRITICAL | IMPORTANT | MINOR]
**Applies to**: [OBSERVE | SEGMENT | DECIDE | ACT | VERIFY | LEARN | ALL]
```

---

## Pre-Loaded Rules (from project history)

### 2026-03-17 — Never force-seed DynamoDB
**Trigger**: Project memory — force-seed wipes user-uploaded images with no undo
**Rule**: NEVER use `"force": true` on seed API. Use targeted field updates or merge seed only.
**Severity**: CRITICAL
**Applies to**: ACT

### 2026-03-17 — Targeted updates over broad operations
**Trigger**: Project memory — changing a URL in buttons should be a targeted DynamoDB update, not a full re-seed
**Rule**: For field-level changes (URLs, text, toggles), use `/api/admin/content/find-replace` or `/api/admin/content/sections`. Never re-seed when a targeted fix works.
**Severity**: CRITICAL
**Applies to**: ACT

### 2026-03-17 — Amplify is production, not staging
**Trigger**: Project memory — `main.danki5kmggsn7.amplifyapp.com` is the live site
**Rule**: Treat all operations against the Amplify URL as production. Test locally first.
**Severity**: CRITICAL
**Applies to**: ALL

### 2026-03-17 — Perplexity API quota exhausted
**Trigger**: Research phase — Perplexity Sonar is currently disabled due to quota
**Rule**: Research fallback chain is Gemini 2.5-Flash → OpenRouter Gemini. Do not attempt Perplexity until quota is confirmed restored.
**Severity**: IMPORTANT
**Applies to**: DECIDE (content generation)

### 2026-03-17 — Notion sync uses NOTION_FORMS_TOKEN
**Trigger**: Multiple Notion tokens exist — wrong one causes silent sync failures
**Rule**: Lead/form sync uses `NOTION_FORMS_TOKEN` (JHR Website Forms DB). Assignment system uses `NOTION_TOKEN` (n8n Integration). Do not cross these.
**Severity**: IMPORTANT
**Applies to**: ACT

---

## Cycle Lessons

_Lessons from actual optimization cycles will be appended below as the engine runs._
