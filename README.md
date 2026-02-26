# Multi-Agent Code Review Demo

A demonstration of collaborative development using multiple AI agents with human oversight.

## Project Structure

```
├── src/               # Source code
├── .github/           # GitHub workflows and configs
│   └── workflows/     # CI/CD automation
├── agents/            # Agent-specific documentation
└── docs/              # Project documentation
```

## Development Workflow

1. **Dual-Agent Development**: Two agents (Kimi + Codex) collaborate on features
2. **Automated Code Review**: Sonnet 4.5 reviews all PRs
3. **Human Approval Required**: At least one human must approve before merge
4. **Branch Protection**: Enforces review requirements

## Agents

| Agent | Model | Role |
|-------|-------|------|
| Developer A | Kimi K2.5 | Primary implementation |
| Developer B | Codex | Review + alternative implementation |
| Reviewer | Sonnet 4.5 | Code review and quality checks |

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

## License

MIT
