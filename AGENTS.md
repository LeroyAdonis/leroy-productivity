<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## AI Blueprint Workflow

State lives in `blueprint/` not chat. See `.agents/skills/` for skills: adopt, onboard, overview, feature, implement, check, audit, complete, fix, debug, rollback, status, doctor, brief, try, prototype, release, tests, ci, discovery, autopilot.

Core loop (run via `run-agent` to stay on free OpenCode lanes):
1. `/adopt` (or `/onboard`) → generates `project-plan.md`, `build-plan.md` (shipped `[x]`, roadmap `[ ]`), `coding-standards.md`
2. `/overview` → generates `blueprint/context/project-overview.md`
3. `/feature N` → writes spec to `blueprint/context/current-feature.md`, stops for review (human gate)
4. `/implement` → one build step at a time, verify each step yourself (tsc + convex typecheck) before committing a checkpoint
5. `/check` → proves done-whens at runtime
6. `/audit current` → writes findings to `blueprint/context/findings.md` (F-IDs, P0-P3); P0/P1 open findings block `/complete`
7. `/complete` → archives feature to `blueprint/history/features/`, resets current-feature.md, updates build plan. Do the merge manually after (squash to main).

Always verify agent output — exit 0 is not success. Check the file exists and has content.

Never skip the human review gates: spec review before code, each implement step review, audit before complete.