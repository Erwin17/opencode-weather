# AGENTS.md

## What this is

Spanish-language weather CLI app (`README.md` has the spec and menu mockup): menu-driven console app using OpenMeteo — two-step API flow: geocoding first (`geocoding-api.open-meteo.com/v1/search?name=<city>`), then forecast with returned lat/lon (`api.open-meteo.com/v1/forecast`). Eventually compiled to an executable binary (`bun build --compile`).

Currently a fresh `bun init` scaffold: `index.ts` is still the hello-world stub.

## Runtime: Bun, not Node

`bun-instructions.md` is the canonical guide. Key points:

- Use `bun <file>`, `bun install`, `bunx`, `bun test` — never npm/npx/node/ts-node.
- Bun auto-loads `.env`; don't add dotenv.
- Use built-ins instead of libraries: `fetch`, `Bun.serve()` (not express), `bun:sqlite` (not better-sqlite3), built-in `WebSocket` (not ws), `Bun.file` over node:fs.

## Commands

No scripts defined in package.json. Verify with:

```sh
bun run index.ts        # run the app
bunx tsc --noEmit       # typecheck (typescript installed locally)
```

Tests go in `*.test.ts` using `bun:test` (none exist yet).

## tsconfig strictness gotchas

- `verbatimModuleSyntax`: type-only imports must be `import type { X }`.
- `noUncheckedIndexedAccess`: `arr[i]` / `obj[key]` returns `T | undefined` — guard before use.
- `.ts` extensions allowed in imports (`allowImportingTsExtensions`).

## Conventions

- User-facing CLI text (menus, prompts) is Spanish, matching the README mockup.
