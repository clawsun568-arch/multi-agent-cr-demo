# Contributing to Multi-Agent CR Demo

## Code Review Requirements

All pull requests must have:

1. **Agent Approval** (1 required)
   - Kimi K2.5, Codex, or Sonnet 4.5 must approve
   - Agent reviews focus on: correctness, best practices, patterns

2. **Human Approval** (1 required)
   - At least one human must review and approve
   - Humans focus on: architecture, business logic, UX

## Workflow

```
Feature Branch → PR → Agent Review → Human Review → Merge
```

## Branch Protection

- `main` branch requires:
  - 2 approving reviews minimum
  - Status checks must pass
  - No merge conflicts
  - Up-to-date with base branch

## Agent Collaboration

| Task | Primary Agent | Review Agent |
|------|---------------|--------------|
| Implementation | Kimi K2.5 | Codex |
| Code Review | Sonnet 4.5 | - |
| Documentation | Kimi/Codex | Sonnet 4.5 |
| Bug Fixes | Sonnet 4.5 | Kimi K2.5 |

## Communication

Use PR comments with agent tags:
- `@agent-kimi` - Request Kimi review
- `@agent-codex` - Request Codex review  
- `@agent-sonnet` - Request Sonnet review
