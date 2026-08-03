# mobile-architect

React Native/Expo architecture specialist.

## Configuration

```jsonc
{
  "agent": {
    "mobile-architect": {
      "model": "anthropic/claude-opus-4.1",
      "variant": "primary",
      "mode": "subagent",
      "description": "React Native/Expo architecture specialist",
      "prompt": ".kilo/prompts/mobile-architecture.md",
      "permission": {
        "read": "allow",
        "edit": { "src/": "allow", "tests/": "allow" },
        "bash": { "npx expo": "allow", "npm": "allow", "jest": "allow" },
      },
    },
  },
}
```

## Routing

- CLI: `--agent mobile-architect`
- TUI: `Ctrl+O` agent cycle
