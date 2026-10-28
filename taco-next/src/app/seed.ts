import { PROOF_TIME } from "./environment";
import type { AgentDraft, BrainProfile, ScoutConfig, VisualJob, VisualStage, WorkspaceState } from "./types";
import { VISUAL_STAGE_ORDER } from "./catalog";

export function blankBrain(): BrainProfile {
  return {
    modelMode: "automatic",
    pinnedModelLabel: "",
    fallbackLabels: [],
    systemPrompt: "",
    reasoningWorkflow: "",
    knowledgeCollections: [],
    taskScopedMemory: true,
    persistentVerifiedMemory: false,
    memoryNote: "No verified memory is stored in this preview.",
    skills: [],
    nativeTools: [],
    mcpCapabilities: [],
    budgetNote: "No runtime budget is enforced here. Canonical budgets apply after registration.",
    filesystem: "none",
    approval: "required",
    evaluationFixtures: [],
    measured: null,
    currentJobId: null,
    availability: "unassigned",
  };
}

function draft(input: {
  id: string;
  displayName: string;
  department: string;
  specialisation: string;
  responsibilities: string[];
}): AgentDraft {
  return {
    ...input,
    swarmIds: [],
    status: "draft",
    version: 1,
    identityNote:
      "Draft identity prepared in this preview. The underlying model is separate. No qualifications, employment history, or performance figures are claimed.",
    improvementNotes: [],
    revisions: [
      {
        version: 1,
        at: PROOF_TIME,
        summary: "Drafted from the owner directive inside this isolated preview.",
      },
    ],
    brain: blankBrain(),
  };
}

export function seedAgents(): AgentDraft[] {
  return [
    draft({
      id: "draft.scout.code",
      displayName: "Scout Code",
      department: "Watching Desk",
      specialisation: "Repositories, bugs, duplicate implementations, and development work.",
      responsibilities: ["Discover code and repository work inside an authorised scope."],
    }),
    draft({
      id: "draft.scout.systems",
      displayName: "Scout Systems",
      department: "Watching Desk",
      specialisation: "APIs, services, dependencies, compatibility, updates, and backend systems.",
      responsibilities: ["Discover service and dependency work inside an authorised scope."],
    }),
    draft({
      id: "draft.scout.interface",
      displayName: "Scout Interface",
      department: "Watching Desk",
      specialisation: "Frontend interfaces, UX, applications, integration failures, and improvements.",
      responsibilities: ["Discover interface and integration work inside an authorised scope."],
    }),
    draft({
      id: "draft.desk.analyst",
      displayName: "Desk Analyst",
      department: "Watching Desk",
      specialisation: "Analyse and classify findings.",
      responsibilities: ["Classify a finding before it is grouped or routed."],
    }),
    draft({
      id: "draft.desk.prioritiser",
      displayName: "Desk Prioritiser",
      department: "Watching Desk",
      specialisation: "Deduplicate, prioritise, and group related work.",
      responsibilities: ["Collapse duplicate findings and propose a priority group."],
    }),
    draft({
      id: "draft.desk.router",
      displayName: "Desk Router",
      department: "Watching Desk",
      specialisation: "Route eligible work to a master through the canonical job system.",
      responsibilities: ["Propose a master. Foreman remains the approval and scheduling authority."],
    }),
    draft({
      id: "draft.master.frontend",
      displayName: "Master Frontend",
      department: "Masters",
      specialisation: "Coordinate authorised frontend work.",
      responsibilities: ["Coordinate frontend specialists through Foreman."],
    }),
    draft({
      id: "draft.master.backend",
      displayName: "Master Backend",
      department: "Masters",
      specialisation: "Coordinate authorised backend work on the existing Core.",
      responsibilities: ["Coordinate backend specialists through Foreman."],
    }),
    draft({
      id: "draft.master.engineering",
      displayName: "Master Engineering",
      department: "Masters",
      specialisation: "Coordinate cross-cutting engineering work.",
      responsibilities: ["Coordinate engineering specialists through Foreman."],
    }),
    draft({
      id: "draft.master.code-guardian",
      displayName: "Master Code Guardian",
      department: "Masters",
      specialisation: "Coordinate review, duplication, and regression scrutiny.",
      responsibilities: ["Coordinate guardian specialists through Foreman."],
    }),
    draft({
      id: "draft.master.web",
      displayName: "Master Web Development",
      department: "Masters",
      specialisation: "Coordinate website delivery.",
      responsibilities: ["Coordinate web specialists through Foreman."],
    }),
    draft({
      id: "draft.master.application",
      displayName: "Master Application Development",
      department: "Masters",
      specialisation: "Coordinate application delivery.",
      responsibilities: ["Coordinate application specialists through Foreman."],
    }),
    draft({
      id: "draft.master.game",
      displayName: "Master Game Development",
      department: "Masters",
      specialisation: "Coordinate game development work.",
      responsibilities: ["Coordinate game specialists through Foreman."],
    }),
    draft({
      id: "draft.master.reverse-engineering",
      displayName: "Master Reverse Engineering",
      department: "Masters",
      specialisation: "Coordinate authorised reverse-engineering work.",
      responsibilities: ["Coordinate reverse-engineering specialists through Foreman."],
    }),
    draft({
      id: "draft.master.taco",
      displayName: "Master TACO",
      department: "Masters",
      specialisation: "Coordinate TACO product work.",
      responsibilities: ["Coordinate TACO specialists through Foreman."],
    }),
  ];
}

export function seedScouts(): ScoutConfig[] {
  return [
    {
      id: "scout.code",
      agentId: "draft.scout.code",
      title: "Scout 1 — Code",
      mandate: "Repositories, bugs, duplicate implementations, and development work.",
      authorisedScope: "",
      cadence: "event-driven",
      scheduleNote: "Prefer events. A bounded schedule may be stored here and does not start a watcher.",
    },
    {
      id: "scout.systems",
      agentId: "draft.scout.systems",
      title: "Scout 2 — Systems",
      mandate: "APIs, services, dependencies, compatibility, updates, and backend systems.",
      authorisedScope: "",
      cadence: "event-driven",
      scheduleNote: "Prefer events. A bounded schedule may be stored here and does not start a watcher.",
    },
    {
      id: "scout.interface",
      agentId: "draft.scout.interface",
      title: "Scout 3 — Interface",
      mandate: "Frontend interfaces, UX, applications, integration failures, and improvement opportunities.",
      authorisedScope: "",
      cadence: "event-driven",
      scheduleNote: "Prefer events. A bounded schedule may be stored here and does not start a watcher.",
    },
  ];
}

function stage(id: VisualStage["id"], state: VisualStage["state"], evidence: string): VisualStage {
  return { id, state, evidence };
}

export function proofVisualJob(): VisualJob {
  const order = VISUAL_STAGE_ORDER.map((item) => item.id);
  const stages: VisualStage[] = [
    stage("intake", "recorded", "Written owner directive recorded. Sketch and concept image were not attached to this workspace, so no reference file is stored."),
    stage("visual-analysis", "blocked", "No image-capable model is connected, and no reference image is on file. Analysis was not run."),
    stage("design-spec", "recorded", "Information architecture for this preview was written from the directive: command, chat, watching desk, workforce, factory, projects, capabilities, jobs, visual studio, migration, and settings."),
    stage("frontend", "recorded", "This isolated TACO Next Generation preview is the frontend implementation under test."),
    stage("backend", "blocked", "No second backend was added. Canonical Core contracts are not mounted, so integration was not attempted."),
    stage("browser-render", "pending", "Rendering is pending a browser session against this preview. A static file check is not that session."),
    stage("visual-compare", "blocked", "Comparison needs the owner sketch or concept image. Visual similarity is unassessed."),
    stage("functional-test", "pending", "Local module behaviour can be exercised in the browser. Canonical execution is outside this test."),
    stage("review", "pending", "Owner acceptance is not recorded. Frozen-candidate reviews are separate gates."),
  ];
  if (stages.map((item) => item.id).join() !== order.join()) {
    throw new Error("Proof stages drifted from the workflow order.");
  }
  return {
    id: "visual.taco-ng",
    title: "TACO Next Generation",
    brief: "Build the isolated command surface from the owner directive, using the factory sketch and concept image when those files are actually available.",
    createdAt: PROOF_TIME,
    references: [],
    spec: {
      purpose: "A desktop-first command surface for one Z3R0TH organisation.",
      surfaces: [
        "Command Centre",
        "Z3R0TH Chat",
        "Watching Desk",
        "Workforce identities and brains",
        "Agent Factory and Training Academy",
        "Projects",
        "Capabilities",
        "Jobs and approvals",
        "Visual-to-Software Studio",
        "Migration map",
        "Settings and diagnostics",
        "Factory floor",
      ],
      constraints: [
        "One Core, one Foreman, one model router, one job system, one capability registry.",
        "Legacy TACO stays in place as the rollback implementation.",
        "Unavailable work stays visibly unavailable.",
      ],
      nonGoals: [
        "A second Z3R0TH backend.",
        "Activation of unreviewed workers.",
        "Invented jobs, memories, or performance figures.",
        "Model-weight fine-tuning.",
      ],
    },
    stages,
    visualSimilarity: "not-assessed",
    functionalCompleteness: "partial",
    reusable: true,
  };
}

export function createSeedState(): WorkspaceState {
  return {
    version: 1,
    agents: seedAgents(),
    scouts: seedScouts(),
    planning: [],
    chats: [],
    projects: [],
    visualJobs: [proofVisualJob()],
    deskNotes: [],
    migrationIntents: {},
    settings: { coreHealthUrl: "", density: "comfortable" },
  };
}
