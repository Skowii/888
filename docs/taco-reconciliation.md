# TACO reconciliation — 29 October 2026

Rechecked from this workspace at about 10:32 am Sydney. PR #1 was not merged. Nothing was deployed, restarted, or pushed to a HEX13 remote.

## 1. Canonical system state

| Check | Result |
| --- | --- |
| Path `/mnt/AI/HEX13-vNext` | Absent. `/mnt` is empty. |
| `docs/z3r0th-director-state` | Not readable. |
| Reported director `b2a49322` | Not verified. It was not assumed to be HEAD, and no newer HEAD could be read either. |
| Live TACO revision | Not inspected. |
| Core contracts, CLI contracts, jobs, capability registry | Not mounted. |
| Live services | Not contacted and not restarted. |

GitHub repositories visible for `Skowii`: `888`, `pre-realm-archives`, `pers`, `Z3R0TH`, `Z3R0TH13`, `LinkUp`. Branches on `Z3R0TH` and `Z3R0TH13` are `main` only. Their roots are not a TACO application. `888` contains this preview and nothing else.

## 2. PR #1 source review

Reviewed branch `cursor/taco-next-generation-2647` at `649da4cbb21df72782f5abe698e876a85d768f5a`, plus the reconciliation edits that follow it. Remote: https://github.com/Skowii/888/pull/1. Base `741d736`. Two commits before this recheck: `0d30844dd406cd7da761d3d24721e151ee440448`, `649da4cbb21df72782f5abe698e876a85d768f5a`.

| Surface | What actually works | What is presentation |
| --- | --- | --- |
| Navigation and shell | Hash routes, current page, density, mobile menu, Operator/Factory toggle. Choosing a module leaves Factory mode. | None of those routes call Core. |
| Command Centre | Draft counts and planning-note counts come from the browser store. The unmounted-path banner is a fixed observation. | Core health, execution count, and review rows are status text, not probes of live services. |
| Factory mode | Renders the same store. Scout scope text, operator-note counts, and route-proposal counts change when those drafts change. Stations stay idle. | It does not show worker heartbeats or execution events. |
| Agent drafts | Create, search, improve, duplicate, and save profiles in `localStorage`. Import forces `measured` to null and status back to draft or proposed. | Names are not verified agents. Availability stays `unassigned`. |
| Brain and model controls | Mode and label fields persist on the draft or the chat. | No installed-model discovery and no router call. |
| Browser storage | Key `taco-ng.workspace.v1` survives refresh. Reset and export/import work. Imports over 1 MB are refused. | This is not the agent registry or the job database. |
| Planning notes | Chat, desk, factory, projects, and visual jobs can file notes with `lane: "planning"`. | Foreman does not read them. |
| Jobs and events | The execution column stays unavailable. No job id or event id is minted. | Approvals cannot be granted. |
| Health display | An empty URL records `unavailable` and sends no request. A typed http(s) URL is fetched in the browser. The body is discarded. Jobs stay null. | A successful HTTP status is an observation, not execution authority. |
| Visual-to-Software | Reusable stage record, spec editor, reference metadata, backend in-scope or out-of-scope. Analysis and comparison stay blocked without a reference image and a vision path. | No screenshot-to-code generator. Similarity is `not-assessed`. |
| Capabilities | Static names and a lifecycle table, every stage `not-recorded`. | Not a search of the capability registry. |
| Tests | Unit tests guard drafts, dedup, planning lanes, similarity, and the health body. `scripts/browser-check.mjs` drives Chrome. | They do not exercise live Core. |

Design pieces worth keeping when a real cockpit is wired: `Shell`, hash routing, the Operator/Factory split, the planning/execution layout, the brain form, the visual stage rail, and the pill language for blocked, pending, and local.

## 3. Existing TACO migration inventory

Live TACO source was not opened, so no legacy screen is marked KEEP, UPGRADE, MERGE, ARCHIVE, or REPLACE. Doing that from memory would invent an inventory.

These owner requirements stay in force for the day the tree is mounted:

- Project and business hubs stay.
- Agent and capability records stay.
- Model integrations stay.
- Chats and historical data stay.
- Approval behaviour stays.
- Valid backend contracts stay.

Next Generation rows, classified from the code that was read:

| Piece | Class | Reason |
| --- | --- | --- |
| Shell, type, colour, navigation | KEEP | Reusable and exercised in Chrome. |
| Command Centre layout | KEEP as a shell | Bind it to real health later. |
| Factory floor | UPGRADE | Same records as Operator mode. Worker status waits on verified events. |
| Agent draft editor | KEEP for unsaved drafting | Do not treat it as the registry. |
| Brain schema | KEEP as a mapping target | Identity stays separate from the model. |
| Planning notes | KEEP local | Do not merge them into the canonical job system. |
| Execution lane | UPGRADE | Replace the empty state with the existing job feed after review. |
| Chat | UPGRADE | Local lines are a notebook until conversation ids are shared with `z3`. |
| Model controls | UPGRADE | Labels only, until the one router is connected. |
| Health check | UPGRADE | Point it at the existing Core health contract. Do not add a proxy. |
| Visual workflow | KEEP | Record and spec only. |
| Capability table | REPLACE CANDIDATE for the display | Swap the static list for the real registry. |
| Project switcher | KEEP as a pattern | Do not replace business hubs with these bookmarks. |
| Seeded scout and master names | ARCHIVE after registry import | Sample drafts, not a staffed organisation. |
| Whole preview as a second app | Do not MERGE blindly | No live data, no CLI, no approvals. |

## 4. Reusable Next Generation components

- `taco-next/src/ui/Shell.tsx` — frame, mode switch, module nav.
- `taco-next/src/app/routes.ts` — hash routes.
- `taco-next/src/app/types.ts` — draft identity and brain shape.
- `taco-next/src/app/logic.ts` — search-before-create, dedup, planning lane, import guard.
- `taco-next/src/views/Jobs.tsx` — planning versus execution.
- `taco-next/src/views/FactoryFloor.tsx` — same-store floor.
- `taco-next/src/views/VisualStudio.tsx` — nine-stage workflow.
- `taco-next/src/styles.css` — desktop-first layout and compact density.

## 5. Daily Driver review status

| Candidate | Bytes in this workspace | Hash | Review |
| --- | --- | --- | --- |
| `taco-core-r1` | No | Unknown | Blocked. Cannot review bytes that are not here. |
| `taco-cockpit-r1` | No | Unknown | Blocked. |
| `z3-interactive-r2` | No | Unknown | Blocked. |
| `z3r0th-dev-worker-r3` | No | Unknown | Separate gate. Not opened. `dev-pilot-002` not run. |

No independent review was invented, and none of those trees were integrated.

## 6. Integration plan

An isolated integration preview was not built. The review gate is closed, so a cockpit that claimed real conversations or jobs would be another disconnected app.

When the canonical tree and the exact candidate hashes are available, the preview should be a separate worktree that only reads existing contracts:

1. Record the real director HEAD. Compare it with `b2a49322` instead of assuming they match.
2. Hash the frozen `taco-core-r1`, `taco-cockpit-r1`, and `z3-interactive-r2` trees and obtain independent review of those hashes.
3. Point the health control at the existing Core health endpoint.
4. List installed models from the existing router, and switch models through that router.
5. Open one canonical conversation and show the same id from TACO and `z3`.
6. Show one existing job and one existing event. Keep planning notes on the other side of the screen.
7. Show agent availability from the existing registry.
8. Run one already-authorised read-only tool call and show its record.
9. Leave approvals with the owner. Leave Foreman R3 closed.
10. Add no second backend, scheduler, model gateway, or agent registry.

Factory mode may show a worker or an event only after that record exists. Until then it stays idle.

## 7. Browser evidence

`taco-next/scripts/browser-check.mjs` against the Vite server, using system Chrome, exited 0 on this recheck. It reloaded the planning note and still found it, requested `http://127.0.0.1:9/no-core` and showed a failed read without creating a job, and reported no page errors. Visual similarity was not scored. The factory sketch is still missing.

## 8. Functional and security tests

Functional:

- `npm test` — draft truth, dedup, planning lane, blocked visual analysis, health body dropped, oversized import refused.
- Browser script — navigation, factory idle state, chat, jobs, desk dedup, profile save, factory search, visual block, capability table, project kept out of the sidebar, migration intent, empty health, refused health URL, refresh, 390px menu.

Security, from this workspace:

- `npm audit` after moving the devDependency `vitest` from 3.2.7 to 4.1.12: 0 vulnerabilities. The previous critical findings were `vitest` `<=4.1.10` and `tinypool` `<=2.1.1`, both on the test-runner path. Production dependencies are React 19 and the two font packages.
- The install needed `npm install -D vitest@4.1.12 --legacy-peer-deps` because npm 10.9.9 crashed in Arborist while building the peer set. The lockfile is what later installs should use.
- Health responses are drained and not copied into the UI or into draft storage.
- Draft import refuses files over 1,000,000 characters.
- React renders operator text as text. There is no HTML injection path in the views.
- Drafts, including prompts, sit in `localStorage` on the browser origin. That is an operator-machine copy, not a server store.
- The health URL is fetched by the page itself. It is not a backend proxy. Only `http:` and `https:` are accepted.
- No service worker, no new server, no credential store.

## 9. Exact hashes

| Object | Hash |
| --- | --- |
| `888` `main` | `741d736aea0a5b4fec3d981d3e18b8148de5b125` |
| PR commit 1 | `0d30844dd406cd7da761d3d24721e151ee440448` |
| PR commit 2, the tree reviewed before this recheck | `649da4cbb21df72782f5abe698e876a85d768f5a` |
| Reported director | `b2a49322` — prefix only, not verified, not confirmed as HEAD |
| `taco-core-r1` | Unknown |
| `taco-cockpit-r1` | Unknown |
| `z3-interactive-r2` | Unknown |
| `z3r0th-dev-worker-r3` | Unknown |

The reconciliation commit that adds this file is the child of `649da4c` on `cursor/taco-next-generation-2647`. Its hash is the commit that introduces this document.

## 10. Remaining owner gates

- Mount `/mnt/AI/HEX13-vNext` and read the current director HEAD.
- Independent review of the exact Daily Driver hashes.
- Foreman R3 stays closed.
- Attach the factory sketch before any visual comparison.
- Authorise model discovery, one conversation, and one read-only tool call through the existing Core and CLI.
- Accept any agent before it is registered.
- Deploy and merge remain separate decisions. This recheck did not do either.
