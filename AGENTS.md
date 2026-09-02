# AGENTS.md

## What this is

Spanish-language weather CLI app (`README.md` has the spec and menu mockup): menu-driven console app using OpenMeteo — two-step API flow: geocoding first (`geocoding-api.open-meteo.com/v1/search?name=<city>`), then forecast with returned lat/lon (`api.open-meteo.com/v1/forecast`). Eventually compiled to an executable binary (`bun build --compile`).

### Architecture

- `index.ts` — entry point, main loop and user interaction
- `src/api.ts` — OpenMeteo API calls (geocoding + forecast)
- `src/ui.ts` — menu rendering, formatting, output helpers
- `src/store.ts` — JSON file persistence (`~/.config/weather/`)
- `src/colors.ts` — ANSI color helpers with TTY detection

## Runtime: Bun, not Node

`bun-instructions.md` is the canonical guide. Key points:

- Use `bun <file>`, `bun install`, `bunx`, `bun test` — never npm/npx/node/ts-node.
- Bun auto-loads `.env`; don't add dotenv.
- Use built-ins instead of libraries: `fetch`, `Bun.serve()` (not express), `bun:sqlite` (not better-sqlite3), built-in `WebSocket` (not ws), `Bun.file` over node:fs.

## Commands

Scripts in package.json:

```sh
bun run start         # run the app (src/index.ts)
bun run dev           # run with --watch
bun run test          # run all tests in test/ (bun test --isolate)
bun run build         # gate: run tests, only compile binary if all pass
bunx tsc --noEmit     # typecheck (typescript installed locally)
```

`build` runs `bun test --isolate test/` first and only compiles `weather` if every test passes (the "don't build if tests fail" rule).

Tests go in `*.test.ts` under `test/` using `bun:test`. Run with `--isolate` so `mock.module` and `globalThis.fetch` mocks don't leak across test files.

## tsconfig strictness gotchas

- `verbatimModuleSyntax`: type-only imports must be `import type { X }`.
- `noUncheckedIndexedAccess`: `arr[i]` / `obj[key]` returns `T | undefined` — guard before use.
- `.ts` extensions allowed in imports (`allowImportingTsExtensions`).
- Test helper types: to type a lazily-imported action use `type Fn = typeof import("../../src/actions/x.ts").fn`, not `import type { fn }` (that fails with `verbatimModuleSyntax` since it's a value).

## Conventions

- User-facing CLI text (menus, prompts) is Spanish, matching the README mockup.
