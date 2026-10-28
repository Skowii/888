import type { StageId } from "./types";

export const LIFECYCLE = [
  "acquired",
  "inspected",
  "installed",
  "tested",
  "agent-callable",
  "job-recorded",
  "cli-observable",
  "taco-observable",
  "owner-accepted",
  "active",
] as const;

export type LifecycleStage = (typeof LIFECYCLE)[number];

export interface CapabilityCandidate {
  id: string;
  name: string;
  source: string;
  kind: string;
  purpose: string;
  stages: Record<LifecycleStage, "not-recorded">;
}

function unrecorded(): Record<LifecycleStage, "not-recorded"> {
  return {
    acquired: "not-recorded",
    inspected: "not-recorded",
    installed: "not-recorded",
    tested: "not-recorded",
    "agent-callable": "not-recorded",
    "job-recorded": "not-recorded",
    "cli-observable": "not-recorded",
    "taco-observable": "not-recorded",
    "owner-accepted": "not-recorded",
    active: "not-recorded",
  };
}

export const CAPABILITIES: CapabilityCandidate[] = [
  ["abi-screenshot-to-code", "abi/screenshot-to-code", "GitHub repository", "repository", "Screenshot to interface code"],
  ["sevzq-screenshot-to-html", "sevzq/screenshot-to-html", "GitHub repository", "repository", "Screenshot to HTML"],
  ["playwright-mcp", "Playwright MCP", "MCP", "mcp", "Browser automation"],
  ["chrome-devtools-mcp", "Chrome DevTools MCP", "MCP", "mcp", "Browser inspection"],
  ["ruff", "Ruff", "Python tooling", "cli", "Python lint and format"],
  ["biome", "Biome", "JavaScript tooling", "cli", "JavaScript and TypeScript lint and format"],
  ["ast-grep", "ast-grep", "Code search", "cli", "Structural code search"],
  ["jscpd", "jscpd", "Duplicate detection", "cli", "Copy-paste detection"],
  ["semgrep", "Semgrep", "Code analysis", "cli", "Semantic code search and policy"],
  ["schemathesis", "Schemathesis", "API testing", "cli", "Schema-based API checks"],
  ["superpowers", "Superpowers", "Agent skills", "skills", "Skill library candidate"],
  ["sentry-skills", "Sentry skills", "Agent skills", "skills", "Operational skill candidate"],
  ["opencode-review", "OpenCodeReview", "Review tool", "tool", "Code review candidate"],
  ["rea", "REA (morluto/rea)", "GitHub repository", "repository", "Named only where authorised and supported"],
].map(([id, name, source, kind, purpose]) => ({
  id,
  name,
  source,
  kind,
  purpose,
  stages: unrecorded(),
}));

export interface ReviewGate {
  id: string;
  reportedState: string;
  bytesInWorkspace: false;
  integration: "blocked";
}

export const REVIEW_GATES: ReviewGate[] = [
  {
    id: "taco-core-r1",
    reportedState: "Owner directive describes it as frozen, locally tested, and independently unreviewed.",
    bytesInWorkspace: false,
    integration: "blocked",
  },
  {
    id: "taco-cockpit-r1",
    reportedState: "Owner directive describes it as frozen, locally tested, and independently unreviewed.",
    bytesInWorkspace: false,
    integration: "blocked",
  },
  {
    id: "z3-interactive-r2",
    reportedState: "Owner directive keeps independent review mandatory before those frozen bytes are integrated.",
    bytesInWorkspace: false,
    integration: "blocked",
  },
  {
    id: "z3r0th-dev-worker-r3",
    reportedState: "Owner directive keeps Foreman R3 as a separate gate. dev-pilot-002 stays unrun from this preview.",
    bytesInWorkspace: false,
    integration: "blocked",
  },
];

export interface MigrationRow {
  id: string;
  area: string;
  item: string;
  question: string;
}

export const MIGRATION_ROWS: MigrationRow[] = [
  {
    id: "routes",
    area: "Navigation",
    item: "Legacy route table",
    question: "Which routes still open a working screen, and which are leftovers?",
  },
  {
    id: "chat",
    area: "Conversation",
    item: "Existing chat and session UI",
    question: "Which behaviours already talk to canonical conversation IDs?",
  },
  {
    id: "jobs",
    area: "Jobs",
    item: "Job, activity, and approval views",
    question: "Which views read the canonical job system, and which cache a private copy?",
  },
  {
    id: "agents",
    area: "Workforce",
    item: "Agent and swarm configuration screens",
    question: "Which controls edit the canonical registry, and which are display-only?",
  },
  {
    id: "models",
    area: "Models",
    item: "Model picker and router displays",
    question: "Does the screen use the one model router, or a local list?",
  },
  {
    id: "projects",
    area: "Projects",
    item: "Business, trading, game, content, and site workspaces",
    question: "Which domains deserve a workspace switcher entry after inspection?",
  },
  {
    id: "logs",
    area: "Diagnostics",
    item: "Logs, health, and installer entry points",
    question: "Which panels reflect live Core, and which must stay out of the new shell?",
  },
  {
    id: "assets",
    area: "Presentation",
    item: "Theme, icons, and reusable visual assets",
    question: "Which assets are still accurate, and which encode the old structure?",
  },
  {
    id: "clutter",
    area: "Retirement",
    item: "Duplicate or unused screens",
    question: "Classification waits until the legacy source is actually open. Nothing is marked obsolete yet.",
  },
];

export const FINDING_FIELDS = [
  { field: "source", meaning: "Where the observation came from." },
  { field: "evidence", meaning: "The artefact, diff, log, or response that supports it." },
  { field: "confidence", meaning: "How strongly the evidence supports the claim." },
  { field: "severity", meaning: "Operational weight, separate from confidence." },
  { field: "project", meaning: "The authorised project the finding belongs to." },
  { field: "time", meaning: "When the evidence was observed." },
  { field: "deduplicationIdentity", meaning: "Stable identity used to collapse repeats." },
] as const;

export const DESK_DUTIES = [
  { id: "analyse", title: "Desk 1 — Analyst", duty: "Analyse and classify findings." },
  { id: "prioritise", title: "Desk 2 — Prioritiser", duty: "Deduplicate, prioritise, and group related work." },
  { id: "route", title: "Desk 3 — Router", duty: "Route eligible work toward a master through the canonical job system." },
] as const;

export const VISUAL_STAGE_ORDER: { id: StageId; title: string; detail: string }[] = [
  { id: "intake", title: "Image, screenshot, or sketch", detail: "Photographs, drawings, UI captures, sites, and authorised references." },
  { id: "visual-analysis", title: "Visual analysis", detail: "An eligible image-capable model reads the reference. Similarity is separate from behaviour." },
  { id: "design-spec", title: "Design specification", detail: "Purpose, surfaces, constraints, and non-goals." },
  { id: "frontend", title: "Frontend implementation", detail: "A working interface, reviewed like any other change." },
  { id: "backend", title: "Backend integration", detail: "Existing Core contracts only." },
  { id: "browser-render", title: "Browser rendering", detail: "The result is opened in a real browser." },
  { id: "visual-compare", title: "Visual comparison", detail: "Held against the reference. A likeness is not acceptance." },
  { id: "functional-test", title: "Functional testing", detail: "Tasks, data, and failure paths." },
  { id: "review", title: "Review", detail: "Owner acceptance and the existing approval gates." },
];

export const EXERCISES = [
  { id: "knowledge", title: "Assign validated domain knowledge" },
  { id: "skills", title: "Activate relevant skills" },
  { id: "practice", title: "Run a controlled practice exercise" },
  { id: "tools", title: "Tool-use evaluation" },
  { id: "models", title: "Compare model performance" },
  { id: "recovery", title: "Error handling and recovery" },
  { id: "handoff", title: "Collaboration and handoff" },
] as const;

export const INTEGRATION_PROOF = [
  { id: "conversation", label: "One real interactive conversation", reason: "Core conversations are not connected. Interactive CLI R2 remains unreviewed." },
  { id: "models", label: "Automatic and manual local-model selection that actually routes", reason: "Chat stores a preference label. The model router is not connected." },
  { id: "tool", label: "One authorised specialist tool call", reason: "No tool runner is attached to this preview." },
  { id: "conversation-ids", label: "Matching CLI and TACO conversation IDs", reason: "No shared conversation has been opened." },
  { id: "job-ids", label: "Matching job and event IDs", reason: "No canonical job or event exists for this preview." },
  { id: "finding", label: "A genuine scout finding or imported verified task", reason: "Scouts are not observing. Desk notes are operator notes." },
  { id: "desk", label: "Desk classification and prioritisation of a real finding", reason: "Classification fields exist. They have no scout input." },
  { id: "handoff", label: "Eligible master / Foreman handoff", reason: "Foreman was not contacted. Route proposals stay in planning notes." },
  { id: "execution", label: "Real execution status", reason: "The execution lane has no feed." },
  { id: "approval", label: "Review and approval status", reason: "This preview cannot grant or display a live approval." },
] as const;

export const NEXT_ACTIONS = [
  {
    title: "Mount /mnt/AI/HEX13-vNext and verify director b2a49322",
    detail: "Read the director file, frozen inventories, and approval gates before any integration.",
  },
  {
    title: "Complete independent review of the four frozen candidates",
    detail: "Leave taco-core-r1, taco-cockpit-r1, z3-interactive-r2, and z3r0th-dev-worker-r3 byte-for-byte until that review.",
  },
  {
    title: "Attach the factory sketch and connect an eligible vision path",
    detail: "Visual comparison stays blocked until a real reference and an authorised image-capable model are available through the existing registry.",
  },
] as const;

export const PRINCIPLES = [
  { name: "Z3R0TH", status: "Named. Runtime not mounted here." },
  { name: "Core", status: "Health endpoint unset. No probe was sent at build time." },
  { name: "Foreman", status: "Not contacted." },
  { name: "Model router", status: "Not connected." },
  { name: "Capability registry", status: "Not mounted." },
  { name: "Canonical jobs", status: "Execution lane unavailable." },
  { name: "Agent Factory", status: "Draft workspace in this preview." },
  { name: "TACO Next", status: "This isolated candidate." },
  { name: "Interactive z3", status: "CLI source is not in this workspace." },
] as const;

export const WORKSTREAMS = [
  { id: "A", name: "Frontend", output: "taco-next/src", status: "Preview built in this candidate." },
  { id: "B", name: "Core contracts", output: "taco-next/src/app/coreAdapter.ts", status: "Read-only adapter. Integration blocked." },
  { id: "C", name: "Agent Factory", output: "taco-next/src/app/types.ts", status: "Identity and brain schema, draft UI." },
  { id: "D", name: "Watching Desk", output: "taco-next/src/views/WatchingDesk.tsx", status: "Workflow UI. Scouts are not running." },
  { id: "E", name: "CLI", output: "Not present", status: "Blocked on z3-interactive-r2 review and missing source." },
  { id: "F", name: "Capabilities", output: "taco-next/src/app/catalog.ts", status: "Candidates listed. Registry search not run." },
  { id: "G", name: "Quality", output: "taco-next/src/app/logic.test.ts", status: "Unit checks on truth boundaries. Browser pass recorded in the handoff." },
] as const;

export const NAV = [
  {
    group: "Observe",
    items: [
      { id: "command", href: "#/command", label: "Command Centre" },
      { id: "desk", href: "#/desk", label: "Watching Desk" },
      { id: "jobs", href: "#/jobs", label: "Jobs & Approvals" },
    ],
  },
  {
    group: "Speak",
    items: [{ id: "chat", href: "#/chat", label: "Z3R0TH Chat" }],
  },
  {
    group: "Organise",
    items: [
      { id: "workforce", href: "#/workforce", label: "Workforce" },
      { id: "factory", href: "#/factory", label: "Factory & Academy" },
      { id: "projects", href: "#/projects", label: "Projects" },
    ],
  },
  {
    group: "Build",
    items: [
      { id: "visual", href: "#/visual", label: "Visual Studio" },
      { id: "capabilities", href: "#/capabilities", label: "Capabilities" },
      { id: "migration", href: "#/migration", label: "Migration Map" },
    ],
  },
  {
    group: "System",
    items: [{ id: "settings", href: "#/settings", label: "Settings" }],
  },
] as const;

export const DEPARTMENTS = ["Watching Desk", "Masters", "Specialists", "Factory", "Projects"] as const;

export const PROJECT_DOMAINS = [
  { id: "business", label: "Business" },
  { id: "trading", label: "Trading" },
  { id: "game", label: "Game development" },
  { id: "content", label: "Content" },
  { id: "web", label: "Web" },
  { id: "general", label: "General" },
] as const;
