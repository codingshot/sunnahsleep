# GitHub Setup for SunnahSleep

## For Maintainers

### Labels

Create these labels in repo Settings → Labels (if not auto-created by templates):

| Label | Color | Description |
|-------|-------|-------------|
| `bug` | #d73a4a | Something isn't working |
| `enhancement` | #a2eeef | New feature or request |
| `documentation` | #0075ca | Docs improvements |
| `islamic-content` | #7057ff | Hadith, Quran, translation |
| `api` | #fbca04 | Prayer times, geolocation |
| `security` | #ee0701 | Security concern |
| `performance` | #fbca04 | Performance issue |
| `triage` | #d4c5f9 | Needs triage |

### OpenClaw / Moltbot Integration

1. **PR review:** Bot fetches PR via `gh pr view <num>` and diff via `gh pr diff`. Use `.github/AGENT-CONTEXT.md` for project context.
2. **Bug fix:** Bot reads issue, identifies component/hook from AGENT-CONTEXT, applies skills from `.cursor/skills/`.
3. **Manual context:** Run workflow "AI Review Context" from Actions to post a summary comment on a PR.

### Workflows

- **CI** – Lint + test on push/PR
- **PR Review** – Build check on PR
- **Issue Triage** – Auto-labels new issues
- **AI Review Context** – Manual: posts PR context comment for AI agents
