export type ModelMode = "automatic" | "pinned";
export type AgentStatus = "draft" | "proposed";
export type FilesystemGrant = "none" | "read" | "workspace-write";
export type ApprovalRequirement = "required" | "scoped";
export type ImportIntent = "undecided" | "import-later" | "hold" | "inspect-before-drop";
export type ProjectDomain = "business" | "trading" | "game" | "content" | "web" | "general";
export type StageId =
  | "intake"
  | "visual-analysis"
  | "design-spec"
  | "frontend"
  | "backend"
  | "browser-render"
  | "visual-compare"
  | "functional-test"
  | "review";
export type StageState = "recorded" | "pending" | "blocked" | "not-applicable";
export type PlanningSource = "chat" | "factory" | "visual" | "desk" | "project" | "migration";
export type Confidence = "low" | "medium" | "high";
export type Severity = "info" | "low" | "medium" | "high";

export interface Revision {
  version: number;
  at: string;
  summary: string;
}

export interface BrainProfile {
  modelMode: ModelMode;
  pinnedModelLabel: string;
  fallbackLabels: string[];
  systemPrompt: string;
  reasoningWorkflow: string;
  knowledgeCollections: string[];
  taskScopedMemory: boolean;
  persistentVerifiedMemory: boolean;
  memoryNote: string;
  skills: string[];
  nativeTools: string[];
  mcpCapabilities: string[];
  budgetNote: string;
  filesystem: FilesystemGrant;
  approval: ApprovalRequirement;
  evaluationFixtures: string[];
  measured: null;
  currentJobId: null;
  availability: "unassigned";
}

export interface AgentDraft {
  id: string;
  displayName: string;
  department: string;
  swarmIds: string[];
  responsibilities: string[];
  specialisation: string;
  status: AgentStatus;
  version: number;
  identityNote: string;
  improvementNotes: string[];
  revisions: Revision[];
  brain: BrainProfile;
}

export interface ScoutConfig {
  id: string;
  agentId: string;
  title: string;
  mandate: string;
  authorisedScope: string;
  cadence: "event-driven" | "bounded-schedule";
  scheduleNote: string;
}

export interface PlanningNote {
  id: string;
  title: string;
  detail: string;
  source: PlanningSource;
  createdAt: string;
  projectId: string | null;
  lane: "planning";
}

export interface ChatDraft {
  id: string;
  title: string;
  agentId: string | null;
  modelMode: ModelMode;
  modelLabel: string;
  lines: { id: string; at: string; text: string }[];
}

export interface ProjectWorkspace {
  id: string;
  name: string;
  domain: ProjectDomain;
  summary: string;
  createdAt: string;
}

export interface DesignSpec {
  purpose: string;
  surfaces: string[];
  constraints: string[];
  nonGoals: string[];
}

export interface VisualReference {
  id: string;
  name: string;
  kind: "photograph" | "sketch" | "screenshot" | "website" | "note";
  note: string;
}

export interface VisualStage {
  id: StageId;
  state: StageState;
  evidence: string;
}

export interface VisualJob {
  id: string;
  title: string;
  brief: string;
  createdAt: string;
  references: VisualReference[];
  spec: DesignSpec;
  stages: VisualStage[];
  visualSimilarity: "not-assessed";
  functionalCompleteness: "partial" | "not-assessed";
  reusable: true;
}

export interface DeskNote {
  id: string;
  source: string;
  evidence: string;
  confidence: Confidence;
  severity: Severity;
  project: string;
  time: string;
  dedupId: string;
  classification: string;
  priorityGroup: string;
  routeTarget: string;
  lane: "local-note";
}

export interface Settings {
  coreHealthUrl: string;
  density: "comfortable" | "compact";
}

export interface WorkspaceState {
  version: 1;
  agents: AgentDraft[];
  scouts: ScoutConfig[];
  planning: PlanningNote[];
  chats: ChatDraft[];
  projects: ProjectWorkspace[];
  visualJobs: VisualJob[];
  deskNotes: DeskNote[];
  migrationIntents: Record<string, ImportIntent>;
  settings: Settings;
}

export interface CoreHealth {
  status: "unavailable" | "observed" | "error";
  endpoint: string | null;
  httpStatus: number | null;
  detail: string;
  observedAt: string;
  jobs: null;
  events: null;
  conversationId: null;
}
