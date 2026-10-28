# Director handoff — TACO Next Generation

Isolated frontend candidate. Built in `Skowii/888` because `/mnt/AI/HEX13-vNext` was not on this machine.

## What was actually observed

- Workspace: `Skowii/888`, base `741d736` (`Initial commit`, README only).
- Expected canonical path `/mnt/AI/HEX13-vNext`: not mounted.
- Expected director file `docs/z3r0th-director-state`: not present.
- Reported director `b2a49322`: not verified. No commit with that id was available to read.
- Public repositories visible for the owner: `888`, `Z3R0TH`, `Z3R0TH13`, `pre-realm-archives`, `pers`, `LinkUp`.
- `Z3R0TH` and `Z3R0TH13` roots look like virtual environments. They were not treated as TACO.
- Live Core, live TACO, and the Links installer were not opened, restarted, or modified.
- No sudo, production deploy, or worker launch.

## Workstreams

These are directories and contracts inside this candidate. Separate cloud workers were not started: the canonical tree was absent, and the screens share one schema.

| Id | Workstream | Output | State |
| --- | --- | --- | --- |
| A | Frontend | `taco-next/src` | Preview built |
| B | Core contracts | `taco-next/src/app/coreAdapter.ts` | Read-only health probe. Jobs stay null |
| C | Agent Factory | `taco-next/src/app/types.ts`, `seed.ts`, Factory & Academy | Schema and drafts |
| D | Watching Desk | `taco-next/src/views/WatchingDesk.tsx` | Configurable drafts. Scouts do not run |
| E | CLI | none | Source absent. `z3-interactive-r2` still blocked |
| F | Capabilities | `taco-next/src/app/catalog.ts` | Names listed. Nothing acquired |
| G | Quality | `taco-next/src/app/logic.test.ts`, `taco-next/scripts/browser-check.mjs` | Unit checks. Browser pass recorded below when this file says so |

## New TACO architecture

Vite + React + TypeScript. No server, no second job queue, no model router, no agent registry.

Operator mode and Factory mode read the same browser store (`taco-ng.workspace.v1`) and the same Core adapter.

Navigation:

- Command Centre
- Watching Desk
- Jobs & Approvals
- Z3R0TH Chat
- Workforce (roster and brain profiles)
- Factory & Academy
- Projects (domain switcher, not sidebar entries)
- Visual Studio
- Capabilities
- Migration Map
- Settings & Diagnostics

Hash routes live in `taco-next/src/app/routes.ts`.

## Legacy migration inventory

Legacy TACO source was not inspected, so no screen is marked obsolete or approved for import. The checklist is the Migration Map. Each row can store a local intent: undecided, import after inspection, hold in legacy, inspect before dropping. Intents do not delete anything.

Areas waiting on the real tree: routes, conversation UI, job and approval views, agent screens, model picker, domain workspaces, diagnostics and installer entry points, visual assets, and unused screens.

## Agent Factory schema

`AgentDraft` plus `BrainProfile` in `taco-next/src/app/types.ts`.

- Stable id and display name, separate from any model label.
- Placeholder monogram. No claimed likeness.
- Department, swarm ids, responsibilities, specialisation.
- Model mode `automatic` or `pinned`, plus fallback labels.
- System prompt and reasoning workflow.
- Knowledge collection names.
- Task-scoped and persistent-verified memory as intent flags. No memory text is generated.
- Skills, native tools, MCP names.
- Filesystem grant: none, read, or workspace-write. Approval: required or scoped.
- Evaluation fixtures. `measured` is forced to `null` on save and on import.
- `currentJobId` is forced to `null`. Availability stays `unassigned`.
- Local version history records operator saves only.

Seeded drafts: Scout Code, Scout Systems, Scout Interface, Desk Analyst, Desk Prioritiser, Desk Router, and nine masters (Frontend, Backend, Engineering, Code Guardian, Web, Application, Game, Reverse Engineering, TACO). Status is `draft`. No specialist roster is pretended.

The factory search requires three characters. A matching draft blocks the “new definition” action. An unmatched search can create one draft. Registration stays disabled.

Academy actions add an unrun fixture. Run and fine-tune stay disabled.

## Watching Desk workflow

1. Scout drafts store mandate, scope text, and a cadence preference (event-driven or bounded schedule). Saving does not start a watcher. Discover stays disabled.
2. Desk duties are classify, deduplicate and prioritise, then route.
3. An operator note requires evidence, project, and a deduplication identity. A repeated identity is refused.
4. A route proposal files a planning note aimed at a master draft. Enqueue to the canonical job system stays disabled.
5. Masters have no private scheduler.

Finding fields required by the schema: source, evidence, confidence, severity, project, time, deduplication identity.

## Visual-to-Software

Reusable job type `VisualJob`. Stages, in order:

1. Image, screenshot, or sketch
2. Visual analysis
3. Design specification
4. Frontend implementation
5. Backend integration
6. Browser rendering
7. Visual comparison
8. Functional testing
9. Review

The proof job `visual.taco-ng` records the written directive and this preview. The owner sketch and concept image were not attached, so visual analysis and visual comparison stay blocked. Similarity is `not-assessed`. Functional completeness is `partial`: local screens were exercised in Chrome, and Core behaviour was not. Review stays pending.

New workflows start unassessed. Attaching a reference does not flip analysis to complete. Backend can be marked out of scope for a static reconstruction, or left blocked while Core is absent. There is no screenshot-to-code generator in this candidate.

## Skills and tools

Candidates named in the directive, all stages `not-recorded`:

abi/screenshot-to-code, sevzq/screenshot-to-html, Playwright MCP, Chrome DevTools MCP, Ruff, Biome, ast-grep, jscpd, Semgrep, Schemathesis, Superpowers, Sentry skills, OpenCodeReview, REA (morluto/rea).

Lifecycle columns: acquired, inspected, installed, tested, agent-callable, job-recorded, cli-observable, taco-observable, owner-accepted, active.

No registry was mounted, so this is not a claim that those tools are absent on the Kubuntu machine. Nothing was downloaded. Licences were not retrieved. No skill was enabled.

## CLI

`z3` is not in this workspace. Existing commands could not be listed. No CLI-only database was created. Chat stores local lines and a model-preference label. Send to Core stays disabled. Shared conversation, job, and event ids: none.

## Job and event ids

None. The execution lane is unavailable. Planning notes use local ids with `lane: "planning"` and are not a Foreman queue.

## Independent review status

Reported by the owner directive, bytes not in this workspace, integration blocked:

- `taco-core-r1`
- `taco-cockpit-r1`
- `z3-interactive-r2`
- `z3r0th-dev-worker-r3` (Foreman R3 / `dev-pilot-002` not run)

This preview does not import those candidates.

## Owner gates still closed

- Verify director `b2a49322` against the mounted tree.
- Independent review of the four frozen candidates.
- Attach the factory sketch and concept image before any visual comparison.
- Authorise a vision model and browser tooling through the existing capability registry.
- Connect chat, jobs, and events only through reviewed Core contracts.
- Accept any agent definition before it can be registered.

## Live service state

No live service was inspected or changed from this workspace. The preview’s health control queries a URL only when an operator types one. An empty URL records `unavailable` and does not send a request.

## Browser evidence

Headless Chrome (`/usr/local/bin/google-chrome`) ran `taco-next/scripts/browser-check.mjs` against the Vite preview on 29 October 2026 (Sydney). The script cleared browser drafts, then:

- Command Centre showed Core unmounted and director `b2a49322` unverified. No success-rate figure was present.
- Factory mode showed idle stations and scouts not observing.
- Chat kept an operator line and filed it as a planning note.
- Jobs showed that note on the planning side. The execution side stayed unavailable, with no job id.
- Watching Desk saved an operator note and refused a repeated deduplication identity.
- Workforce renamed Master Frontend and kept registration disabled.
- Factory search found the renamed frontend draft, then created a new draft only after an unmatched search.
- Visual Studio kept image analysis blocked.
- screenshot-to-code remained “Not recorded”.
- A trading workspace named Northwind Books stayed out of the sidebar.
- Migration intent for the legacy route table saved as “hold”.
- Settings health check with an empty URL returned unavailable. Compact density applied.
- At 390px width the menu opened Watching Desk.

Unit tests in `taco-next/src/app/logic.test.ts` cover the same truth boundaries: unmeasured drafts, stripped fabricated scores on import, blocked visual analysis, and a null job feed.

Screenshots from that pass: `01-command`, `02-factory`, `08-visual`.

A second headed Chrome pass (`taco-next/scripts/browser-demo.mjs`) walked Command Centre, the idle factory floor, Visual Studio, a local chat line, and the planning-versus-execution jobs view.

## Three next actions

1. Mount `/mnt/AI/HEX13-vNext` and read `docs/z3r0th-director-state` before integrating anything.
2. Finish independent review of `taco-core-r1`, `taco-cockpit-r1`, `z3-interactive-r2`, and `z3r0th-dev-worker-r3` without editing their frozen bytes.
3. Add the owner sketch and an eligible image-capable model, then run visual comparison as its own stage. Keep functional testing separate.
