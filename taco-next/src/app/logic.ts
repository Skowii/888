import { MIGRATION_ROWS } from "./catalog";
import { blankBrain, createSeedState } from "./seed";
import type {
  AgentDraft,
  AgentStatus,
  ApprovalRequirement,
  DeskNote,
  FilesystemGrant,
  ImportIntent,
  ModelMode,
  PlanningNote,
  PlanningSource,
  ProjectDomain,
  VisualJob,
  VisualReference,
  WorkspaceState,
} from "./types";

export function newId(prefix: string): string {
  const rand = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  return `${prefix}.${rand}`;
}

function cleanList(values: string[]): string[] {
  return values.map((value) => value.trim()).filter(Boolean);
}

function asStatus(value: unknown): AgentStatus {
  return value === "proposed" ? "proposed" : "draft";
}

function asFilesystem(value: unknown): FilesystemGrant {
  return value === "read" || value === "workspace-write" ? value : "none";
}

function asApproval(value: unknown): ApprovalRequirement {
  return value === "scoped" ? "scoped" : "required";
}

function asModelMode(value: unknown): ModelMode {
  return value === "pinned" ? "pinned" : "automatic";
}

function guardBrain(input: AgentDraft["brain"] | undefined): AgentDraft["brain"] {
  const base = blankBrain();
  if (!input || typeof input !== "object") return base;
  return {
    ...base,
    modelMode: asModelMode(input.modelMode),
    pinnedModelLabel: String(input.pinnedModelLabel ?? ""),
    fallbackLabels: cleanList(Array.isArray(input.fallbackLabels) ? input.fallbackLabels.map(String) : []),
    systemPrompt: String(input.systemPrompt ?? ""),
    reasoningWorkflow: String(input.reasoningWorkflow ?? ""),
    knowledgeCollections: cleanList(Array.isArray(input.knowledgeCollections) ? input.knowledgeCollections.map(String) : []),
    taskScopedMemory: Boolean(input.taskScopedMemory),
    persistentVerifiedMemory: Boolean(input.persistentVerifiedMemory),
    memoryNote: String(input.memoryNote ?? base.memoryNote),
    skills: cleanList(Array.isArray(input.skills) ? input.skills.map(String) : []),
    nativeTools: cleanList(Array.isArray(input.nativeTools) ? input.nativeTools.map(String) : []),
    mcpCapabilities: cleanList(Array.isArray(input.mcpCapabilities) ? input.mcpCapabilities.map(String) : []),
    budgetNote: String(input.budgetNote ?? base.budgetNote),
    filesystem: asFilesystem(input.filesystem),
    approval: asApproval(input.approval),
    evaluationFixtures: cleanList(Array.isArray(input.evaluationFixtures) ? input.evaluationFixtures.map(String) : []),
    measured: null,
    currentJobId: null,
    availability: "unassigned",
  };
}

function guardAgent(input: unknown): AgentDraft | null {
  if (!input || typeof input !== "object") return null;
  const raw = input as Partial<AgentDraft>;
  if (!raw.id || !raw.displayName) return null;
  return {
    id: String(raw.id),
    displayName: String(raw.displayName),
    department: String(raw.department ?? "Specialists"),
    swarmIds: cleanList(Array.isArray(raw.swarmIds) ? raw.swarmIds.map(String) : []),
    responsibilities: cleanList(Array.isArray(raw.responsibilities) ? raw.responsibilities.map(String) : []),
    specialisation: String(raw.specialisation ?? ""),
    status: asStatus(raw.status),
    version: Number.isFinite(raw.version) ? Math.max(1, Number(raw.version)) : 1,
    identityNote: String(raw.identityNote ?? ""),
    improvementNotes: cleanList(Array.isArray(raw.improvementNotes) ? raw.improvementNotes.map(String) : []),
    revisions: Array.isArray(raw.revisions)
      ? raw.revisions
          .filter((item) => item && typeof item === "object")
          .map((item) => ({
            version: Number(item.version) || 1,
            at: String(item.at ?? ""),
            summary: String(item.summary ?? ""),
          }))
      : [],
    brain: guardBrain(raw.brain),
  };
}

export function normalizeState(input: unknown): WorkspaceState | null {
  if (!input || typeof input !== "object") return null;
  const raw = input as Partial<WorkspaceState>;
  if (raw.version !== 1) return null;
  const seed = createSeedState();
  const agents = Array.isArray(raw.agents) ? raw.agents.map(guardAgent).filter((item): item is AgentDraft => item !== null) : [];
  if (!agents.length) return null;
  const intents: WorkspaceState["migrationIntents"] = {};
  if (raw.migrationIntents && typeof raw.migrationIntents === "object") {
    for (const [key, value] of Object.entries(raw.migrationIntents)) {
      if (value === "import-later" || value === "hold" || value === "inspect-before-drop" || value === "undecided") {
        intents[key] = value;
      }
    }
  }
  return {
    version: 1,
    agents,
    scouts: Array.isArray(raw.scouts) && raw.scouts.length ? raw.scouts.map((scout) => ({
      id: String(scout.id),
      agentId: String(scout.agentId),
      title: String(scout.title),
      mandate: String(scout.mandate ?? ""),
      authorisedScope: String(scout.authorisedScope ?? ""),
      cadence: scout.cadence === "bounded-schedule" ? "bounded-schedule" : "event-driven",
      scheduleNote: String(scout.scheduleNote ?? ""),
    })) : seed.scouts,
    planning: Array.isArray(raw.planning)
      ? raw.planning
          .filter((item) => item && typeof item === "object" && item.title)
          .map((item) => ({
            id: String(item.id || newId("plan")),
            title: String(item.title),
            detail: String(item.detail ?? ""),
            source: (["chat", "factory", "visual", "desk", "project", "migration"].includes(String(item.source))
              ? item.source
              : "factory") as PlanningSource,
            createdAt: String(item.createdAt ?? ""),
            projectId: item.projectId ? String(item.projectId) : null,
            lane: "planning" as const,
          }))
      : [],
    chats: Array.isArray(raw.chats)
      ? raw.chats.filter((chat) => chat && chat.id && chat.title).map((chat) => ({
          id: String(chat.id),
          title: String(chat.title),
          agentId: chat.agentId ? String(chat.agentId) : null,
          modelMode: asModelMode(chat.modelMode),
          modelLabel: String(chat.modelLabel ?? ""),
          lines: Array.isArray(chat.lines)
            ? chat.lines.filter((line) => line && line.text).map((line) => ({
                id: String(line.id || newId("line")),
                at: String(line.at ?? ""),
                text: String(line.text),
              }))
            : [],
        }))
      : [],
    projects: Array.isArray(raw.projects)
      ? raw.projects.filter((project) => project && project.id && project.name).map((project) => ({
          id: String(project.id),
          name: String(project.name),
          domain: (["business", "trading", "game", "content", "web", "general"].includes(String(project.domain))
            ? project.domain
            : "general") as ProjectDomain,
          summary: String(project.summary ?? ""),
          createdAt: String(project.createdAt ?? ""),
        }))
      : [],
    visualJobs: (() => {
      const jobs = Array.isArray(raw.visualJobs) ? raw.visualJobs.map(guardVisualJob).filter((job): job is VisualJob => job !== null) : [];
      return jobs.length ? jobs : seed.visualJobs;
    })(),
    deskNotes: Array.isArray(raw.deskNotes) ? raw.deskNotes.map(guardDeskNote).filter((note): note is DeskNote => note !== null) : [],
    migrationIntents: intents,
    settings: {
      coreHealthUrl: String(raw.settings?.coreHealthUrl ?? ""),
      density: raw.settings?.density === "compact" ? "compact" : "comfortable",
    },
  };
}

function guardDeskNote(input: unknown): DeskNote | null {
  if (!input || typeof input !== "object") return null;
  const raw = input as Partial<DeskNote>;
  if (!raw.evidence || !raw.dedupId) return null;
  const confidence = raw.confidence === "low" || raw.confidence === "high" ? raw.confidence : "medium";
  const severity = raw.severity === "info" || raw.severity === "low" || raw.severity === "high" ? raw.severity : "medium";
  return {
    id: String(raw.id || newId("desk")),
    source: String(raw.source ?? "operator"),
    evidence: String(raw.evidence),
    confidence,
    severity,
    project: String(raw.project ?? ""),
    time: String(raw.time ?? ""),
    dedupId: String(raw.dedupId).trim(),
    classification: String(raw.classification ?? ""),
    priorityGroup: String(raw.priorityGroup ?? ""),
    routeTarget: String(raw.routeTarget ?? ""),
    lane: "local-note",
  };
}

const STAGE_IDS = new Set([
  "intake",
  "visual-analysis",
  "design-spec",
  "frontend",
  "backend",
  "browser-render",
  "visual-compare",
  "functional-test",
  "review",
]);

function guardVisualJob(input: unknown): VisualJob | null {
  if (!input || typeof input !== "object") return null;
  const raw = input as Partial<VisualJob>;
  if (!raw.id || !raw.title || !Array.isArray(raw.stages)) return null;
  const stages = raw.stages.filter((stage) => stage && STAGE_IDS.has(String(stage.id)));
  if (!stages.length) return null;
  return {
    id: String(raw.id),
    title: String(raw.title),
    brief: String(raw.brief ?? ""),
    createdAt: String(raw.createdAt ?? ""),
    references: Array.isArray(raw.references)
      ? raw.references.filter((ref) => ref && ref.name).map((ref) => ({
          id: String(ref.id || newId("ref")),
          name: String(ref.name),
          kind: (["photograph", "sketch", "screenshot", "website", "note"].includes(String(ref.kind))
            ? ref.kind
            : "note") as VisualReference["kind"],
          note: String(ref.note ?? ""),
        }))
      : [],
    spec: {
      purpose: String(raw.spec?.purpose ?? ""),
      surfaces: cleanList(Array.isArray(raw.spec?.surfaces) ? raw.spec.surfaces.map(String) : []),
      constraints: cleanList(Array.isArray(raw.spec?.constraints) ? raw.spec.constraints.map(String) : []),
      nonGoals: cleanList(Array.isArray(raw.spec?.nonGoals) ? raw.spec.nonGoals.map(String) : []),
    },
    stages: stages.map((stage) => ({
      id: stage.id,
      state: stage.state === "recorded" || stage.state === "blocked" || stage.state === "not-applicable" ? stage.state : "pending",
      evidence: String(stage.evidence ?? ""),
    })),
    visualSimilarity: "not-assessed",
    functionalCompleteness: raw.functionalCompleteness === "partial" ? "partial" : "not-assessed",
    reusable: true,
  };
}

export function loadWorkspace(raw: string | null): { state: WorkspaceState; warning: string | null } {
  if (!raw) return { state: createSeedState(), warning: null };
  try {
    const normalized = normalizeState(JSON.parse(raw) as unknown);
    if (!normalized) {
      return {
        state: createSeedState(),
        warning: "Stored drafts could not be read. A fresh draft set is showing and will replace the unreadable browser copy.",
      };
    }
    return { state: normalized, warning: null };
  } catch {
    return {
      state: createSeedState(),
      warning: "Stored drafts were not valid JSON. A fresh draft set is showing.",
    };
  }
}

export function importWorkspace(raw: string): { ok: true; state: WorkspaceState } | { ok: false; error: string } {
  try {
    const normalized = normalizeState(JSON.parse(raw) as unknown);
    if (!normalized) return { ok: false, error: "The file is not a version 1 draft workspace." };
    return { ok: true, state: normalized };
  } catch {
    return { ok: false, error: "The file is not valid JSON." };
  }
}

export function searchDrafts(agents: AgentDraft[], query: string):
  | { status: "short"; agents: AgentDraft[] }
  | { status: "none"; agents: AgentDraft[] }
  | { status: "matches"; agents: AgentDraft[] } {
  const q = query.trim().toLowerCase();
  if (q.length < 3) return { status: "short", agents: [] };
  const found = agents.filter((agent) =>
    [agent.displayName, agent.department, agent.specialisation, agent.id, ...agent.responsibilities]
      .join(" ")
      .toLowerCase()
      .includes(q),
  );
  if (!found.length) return { status: "none", agents: [] };
  return { status: "matches", agents: found };
}

export function addPlanning(
  state: WorkspaceState,
  input: { title: string; detail: string; source: PlanningSource; projectId?: string | null },
  nowIso: string,
): WorkspaceState {
  const title = input.title.trim();
  if (!title) return state;
  const note: PlanningNote = {
    id: newId("plan"),
    title,
    detail: input.detail.trim(),
    source: input.source,
    createdAt: nowIso,
    projectId: input.projectId ?? null,
    lane: "planning",
  };
  return { ...state, planning: [note, ...state.planning] };
}

export function saveAgent(state: WorkspaceState, next: AgentDraft, summary: string, nowIso: string): WorkspaceState {
  const guarded = guardAgent({
    ...next,
    version: next.version + 1,
    status: asStatus(next.status),
    revisions: [...next.revisions, { version: next.version + 1, at: nowIso, summary: summary.trim() || "Operator saved the draft." }],
  });
  if (!guarded) return state;
  return { ...state, agents: state.agents.map((agent) => (agent.id === guarded.id ? guarded : agent)) };
}

export function attachImprovement(state: WorkspaceState, agentId: string, note: string, nowIso: string): WorkspaceState {
  const text = note.trim();
  const agent = state.agents.find((item) => item.id === agentId);
  if (!text || !agent) return state;
  const saved = saveAgent(
    state,
    { ...agent, improvementNotes: [...agent.improvementNotes, text] },
    "Improvement note attached.",
    nowIso,
  );
  return addPlanning(saved, {
    title: `Improve ${agent.displayName}`,
    detail: text,
    source: "factory",
  }, nowIso);
}

export function createAgentDraft(
  state: WorkspaceState,
  input: { displayName: string; specialisation: string; department?: string },
  nowIso: string,
): WorkspaceState {
  const displayName = input.displayName.trim();
  if (!displayName) return state;
  const agent: AgentDraft = {
    id: newId("draft.agent"),
    displayName,
    department: input.department?.trim() || "Specialists",
    swarmIds: [],
    responsibilities: [],
    specialisation: input.specialisation.trim(),
    status: "draft",
    version: 1,
    identityNote: "Draft identity. No model, memory, or performance history is attached.",
    improvementNotes: [],
    revisions: [{ version: 1, at: nowIso, summary: "Drafted after a search of existing definitions." }],
    brain: blankBrain(),
  };
  const withAgent = { ...state, agents: [...state.agents, agent] };
  return addPlanning(withAgent, {
    title: `Draft definition: ${displayName}`,
    detail: agent.specialisation || "New specialist definition. Registration is still closed.",
    source: "factory",
  }, nowIso);
}

export function duplicateAgent(state: WorkspaceState, agentId: string, nowIso: string): WorkspaceState {
  const agent = state.agents.find((item) => item.id === agentId);
  if (!agent) return state;
  const copy: AgentDraft = {
    ...structuredClone(agent),
    id: newId("draft.copy"),
    displayName: `${agent.displayName} copy`,
    status: "draft",
    version: 1,
    improvementNotes: [],
    revisions: [{ version: 1, at: nowIso, summary: `Copied from ${agent.id}. Prior revisions were not carried forward.` }],
    brain: { ...structuredClone(agent.brain), measured: null, currentJobId: null, availability: "unassigned" },
  };
  return { ...state, agents: [...state.agents, copy] };
}

export function addFixture(state: WorkspaceState, agentId: string, fixture: string, nowIso: string): WorkspaceState {
  const agent = state.agents.find((item) => item.id === agentId);
  const title = fixture.trim();
  if (!agent || !title) return state;
  if (agent.brain.evaluationFixtures.includes(title)) return state;
  return saveAgent(
    state,
    { ...agent, brain: { ...agent.brain, evaluationFixtures: [...agent.brain.evaluationFixtures, title] } },
    "Unrun evaluation fixture added.",
    nowIso,
  );
}

export function updateScout(
  state: WorkspaceState,
  scoutId: string,
  patch: Partial<Pick<WorkspaceState["scouts"][number], "mandate" | "authorisedScope" | "cadence" | "scheduleNote">>,
): WorkspaceState {
  return {
    ...state,
    scouts: state.scouts.map((scout) => (scout.id === scoutId ? { ...scout, ...patch } : scout)),
  };
}

export function dedupKey(value: string): string {
  return value.trim().toLowerCase();
}

export function addDeskNote(
  state: WorkspaceState,
  input: Omit<DeskNote, "id" | "lane">,
  nowIso: string,
): { ok: true; state: WorkspaceState } | { ok: false; reason: string; existingId: string } {
  const evidence = input.evidence.trim();
  const dedupId = input.dedupId.trim();
  const project = input.project.trim();
  if (!evidence || !dedupId || !project) {
    return { ok: false, reason: "Source evidence, project, and a deduplication identity are required.", existingId: "" };
  }
  const existing = state.deskNotes.find((note) => dedupKey(note.dedupId) === dedupKey(dedupId));
  if (existing) return { ok: false, reason: "A note with this deduplication identity is already recorded.", existingId: existing.id };
  const note: DeskNote = {
    ...input,
    id: newId("desk"),
    evidence,
    dedupId,
    project,
    source: input.source.trim() || "operator",
    time: input.time || nowIso,
    lane: "local-note",
  };
  let next: WorkspaceState = { ...state, deskNotes: [note, ...state.deskNotes] };
  if (note.routeTarget) {
    const master = state.agents.find((agent) => agent.id === note.routeTarget);
    next = addPlanning(next, {
      title: `Route proposal: ${note.project}`,
      detail: `${note.classification || "Unclassified"} → ${master?.displayName ?? note.routeTarget}. Canonical enqueue is unavailable.`,
      source: "desk",
    }, nowIso);
  }
  return { ok: true, state: next };
}

export function createChat(state: WorkspaceState): WorkspaceState {
  const chat = {
    id: newId("chat"),
    title: "New objective",
    agentId: null,
    modelMode: "automatic" as const,
    modelLabel: "",
    lines: [],
  };
  return { ...state, chats: [chat, ...state.chats] };
}

export function updateChat(state: WorkspaceState, chatId: string, patch: Partial<WorkspaceState["chats"][number]>): WorkspaceState {
  return {
    ...state,
    chats: state.chats.map((chat) => (chat.id === chatId ? { ...chat, ...patch, id: chat.id, lines: patch.lines ?? chat.lines } : chat)),
  };
}

export function appendChatLine(state: WorkspaceState, chatId: string, text: string, nowIso: string): WorkspaceState {
  const body = text.trim();
  if (!body) return state;
  return {
    ...state,
    chats: state.chats.map((chat) =>
      chat.id === chatId
        ? { ...chat, lines: [...chat.lines, { id: newId("line"), at: nowIso, text: body }] }
        : chat,
    ),
  };
}

export function fileChatAsPlanning(state: WorkspaceState, chatId: string, nowIso: string): WorkspaceState {
  const chat = state.chats.find((item) => item.id === chatId);
  const last = chat?.lines.at(-1);
  if (!chat || !last) return state;
  return addPlanning(state, {
    title: chat.title.trim() || "Operator objective",
    detail: last.text,
    source: "chat",
  }, nowIso);
}

export function createProject(
  state: WorkspaceState,
  input: { name: string; domain: ProjectDomain; summary: string },
  nowIso: string,
): WorkspaceState {
  const name = input.name.trim();
  if (!name) return state;
  const project = {
    id: newId("project"),
    name,
    domain: input.domain,
    summary: input.summary.trim(),
    createdAt: nowIso,
  };
  const next = { ...state, projects: [project, ...state.projects] };
  return addPlanning(next, {
    title: `Project workspace: ${name}`,
    detail: input.summary.trim(),
    source: "project",
    projectId: project.id,
  }, nowIso);
}

export function createVisualJob(state: WorkspaceState, title: string, nowIso: string): WorkspaceState {
  const name = title.trim();
  if (!name) return state;
  const job: VisualJob = {
    id: newId("visual"),
    title: name,
    brief: "",
    createdAt: nowIso,
    references: [],
    spec: { purpose: "", surfaces: [], constraints: [], nonGoals: [] },
    stages: [
      { id: "intake", state: "pending", evidence: "Waiting for a reference or a written brief." },
      { id: "visual-analysis", state: "blocked", evidence: "No image-capable model is connected in this preview." },
      { id: "design-spec", state: "pending", evidence: "Specification is empty." },
      { id: "frontend", state: "pending", evidence: "No generator is connected. Implementation stays a separate authorised build." },
      { id: "backend", state: "blocked", evidence: "Canonical Core is not connected. This workflow will not create a backend." },
      { id: "browser-render", state: "pending", evidence: "Nothing has been opened in a browser for this job." },
      { id: "visual-compare", state: "blocked", evidence: "Comparison needs a reference and a comparison runner. Similarity is unassessed." },
      { id: "functional-test", state: "pending", evidence: "Functional completeness is unmeasured." },
      { id: "review", state: "pending", evidence: "Owner review is not recorded." },
    ],
    visualSimilarity: "not-assessed",
    functionalCompleteness: "not-assessed",
    reusable: true,
  };
  const next = { ...state, visualJobs: [job, ...state.visualJobs] };
  return addPlanning(next, { title: `Visual workflow: ${name}`, detail: "Reusable visual-to-software record.", source: "visual" }, nowIso);
}

export function addVisualReference(state: WorkspaceState, jobId: string, reference: Omit<VisualReference, "id">): WorkspaceState {
  const name = reference.name.trim();
  if (!name) return state;
  return {
    ...state,
    visualJobs: state.visualJobs.map((job) => {
      if (job.id !== jobId) return job;
      const references = [...job.references, { ...reference, id: newId("ref"), name, note: reference.note.trim() }];
      return {
        ...job,
        references,
        visualSimilarity: "not-assessed" as const,
        stages: job.stages.map((stage) => {
          if (stage.id === "intake") {
            return { ...stage, state: "recorded" as const, evidence: `${references.length} reference record(s). Analysis has not been run.` };
          }
          if (stage.id === "visual-analysis") {
            return { ...stage, state: "blocked" as const, evidence: "A reference is recorded. No image-capable model is connected, so analysis remains blocked." };
          }
          if (stage.id === "visual-compare") {
            return { ...stage, state: "blocked" as const, evidence: "A reference is on file. No comparison runner is connected. Similarity stays unassessed." };
          }
          return stage;
        }),
      };
    }),
  };
}

export function saveVisualSpec(
  state: WorkspaceState,
  jobId: string,
  spec: VisualJob["spec"],
): WorkspaceState {
  const purpose = spec.purpose.trim();
  return {
    ...state,
    visualJobs: state.visualJobs.map((job) => {
      if (job.id !== jobId) return job;
      const nextSpec = {
        purpose,
        surfaces: cleanList(spec.surfaces),
        constraints: cleanList(spec.constraints),
        nonGoals: cleanList(spec.nonGoals),
      };
      return {
        ...job,
        spec: nextSpec,
        stages: job.stages.map((stage) =>
          stage.id === "design-spec"
            ? {
                ...stage,
                state: purpose ? ("recorded" as const) : ("pending" as const),
                evidence: purpose ? purpose : "Specification is empty.",
              }
            : stage,
        ),
      };
    }),
  };
}

export function setBackendApplicability(state: WorkspaceState, jobId: string, applicable: boolean): WorkspaceState {
  return {
    ...state,
    visualJobs: state.visualJobs.map((job) => {
      if (job.id !== jobId) return job;
      return {
        ...job,
        stages: job.stages.map((stage) => {
          if (stage.id !== "backend") return stage;
          return applicable
            ? { ...stage, state: "blocked" as const, evidence: "Backend integration is in scope. Canonical Core is not connected, so the stage stays blocked." }
            : { ...stage, state: "not-applicable" as const, evidence: "Operator marked backend integration out of scope for this static reconstruction." };
        }),
      };
    }),
  };
}

export function setMigrationIntent(state: WorkspaceState, rowId: string, intent: ImportIntent): WorkspaceState {
  if (!MIGRATION_ROWS.some((row) => row.id === rowId)) return state;
  return { ...state, migrationIntents: { ...state.migrationIntents, [rowId]: intent } };
}

export function updateSettings(state: WorkspaceState, patch: Partial<WorkspaceState["settings"]>): WorkspaceState {
  return { ...state, settings: { ...state.settings, ...patch } };
}

export function executionConnected(): false {
  return false;
}

export function formatSydney(iso: string): string {
  if (!iso) return "Time unrecorded";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "Time unrecorded";
  const formatted = new Intl.DateTimeFormat("en-AU", {
    timeZone: "Australia/Sydney",
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
  return `${formatted} Sydney`;
}
