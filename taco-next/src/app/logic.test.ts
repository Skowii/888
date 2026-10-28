import { describe, expect, it } from "vitest";
import { CAPABILITIES, REVIEW_GATES } from "./catalog";
import { observeCore, unavailableHealth } from "./coreAdapter";
import { WORKSPACE_OBSERVATION } from "./environment";
import {
  addDeskNote,
  addVisualReference,
  appendChatLine,
  createAgentDraft,
  createChat,
  createVisualJob,
  fileChatAsPlanning,
  importWorkspace,
  normalizeState,
  searchDrafts,
} from "./logic";
import { createSeedState } from "./seed";

describe("workspace truth", () => {
  it("records that canonical Core was not mounted", () => {
    expect(WORKSPACE_OBSERVATION.canonicalMounted).toBe(false);
    expect(WORKSPACE_OBSERVATION.verifiedDirector).toBeNull();
    expect(WORKSPACE_OBSERVATION.reportedDirector).toBe("b2a49322");
  });

  it("keeps every seeded agent unmeasured and unpublished", () => {
    const state = createSeedState();
    expect(state.agents.length).toBeGreaterThan(0);
    for (const agent of state.agents) {
      expect(agent.status).toBe("draft");
      expect(agent.brain.measured).toBeNull();
      expect(agent.brain.currentJobId).toBeNull();
      expect(agent.brain.availability).toBe("unassigned");
    }
    expect(state.planning).toEqual([]);
    expect(state.deskNotes).toEqual([]);
  });

  it("strips fabricated performance on import", () => {
    const seeded = createSeedState();
    const tampered = structuredClone(seeded) as unknown as {
      agents: { status: string; brain: { measured: { success: number } | null; currentJobId: string | null } }[];
    };
    tampered.agents[0].status = "active";
    tampered.agents[0].brain.measured = { success: 99 };
    tampered.agents[0].brain.currentJobId = "job-fake";
    const imported = importWorkspace(JSON.stringify(tampered));
    expect(imported.ok).toBe(true);
    if (!imported.ok) return;
    expect(imported.state.agents[0].status).toBe("draft");
    expect(imported.state.agents[0].brain.measured).toBeNull();
    expect(imported.state.agents[0].brain.currentJobId).toBeNull();
  });

  it("rejects a visual job that claims similarity", () => {
    const seeded = createSeedState();
    (seeded.visualJobs[0] as { visualSimilarity: string }).visualSimilarity = "match";
    const normalized = normalizeState(seeded);
    expect(normalized?.visualJobs[0].visualSimilarity).toBe("not-assessed");
  });

  it("searches existing drafts before a new specialist is justified", () => {
    const agents = createSeedState().agents;
    expect(searchDrafts(agents, "fr").status).toBe("short");
    const found = searchDrafts(agents, "frontend");
    expect(found.status).toBe("matches");
    expect(found.agents.some((agent) => agent.displayName === "Master Frontend")).toBe(true);
    const created = createAgentDraft(createSeedState(), { displayName: "Chart Reader", specialisation: "Reads charts" }, "2026-10-28T15:00:00.000Z");
    expect(created.agents.at(-1)?.status).toBe("draft");
    expect(created.agents.at(-1)?.brain.measured).toBeNull();
    expect(created.planning[0].lane).toBe("planning");
  });

  it("deduplicates desk notes and keeps them out of execution", () => {
    const now = "2026-10-28T15:00:00.000Z";
    const first = addDeskNote(createSeedState(), {
      source: "operator",
      evidence: "README is the only file",
      confidence: "high",
      severity: "info",
      project: "888",
      time: now,
      dedupId: "Repo-Empty",
      classification: "inventory",
      priorityGroup: "setup",
      routeTarget: "",
    }, now);
    expect(first.ok).toBe(true);
    if (!first.ok) return;
    const second = addDeskNote(first.state, {
      source: "operator",
      evidence: "same fact",
      confidence: "low",
      severity: "low",
      project: "888",
      time: now,
      dedupId: "repo-empty",
      classification: "",
      priorityGroup: "",
      routeTarget: "draft.master.taco",
    }, now);
    expect(second.ok).toBe(false);
    expect(first.state.deskNotes).toHaveLength(1);
    expect(first.state.deskNotes[0].lane).toBe("local-note");
  });

  it("files chat text as planning and leaves execution disconnected", () => {
    const now = "2026-10-28T15:00:00.000Z";
    const started = createChat(createSeedState());
    const chatId = started.chats[0].id;
    const written = appendChatLine(started, chatId, "Inspect the director file", now);
    const filed = fileChatAsPlanning(written, chatId, now);
    expect(filed.planning[0]).toMatchObject({ lane: "planning", source: "chat" });
    expect(filed.planning[0].detail).toBe("Inspect the director file");
  });

  it("keeps visual analysis blocked after a reference is attached", () => {
    const now = "2026-10-28T15:00:00.000Z";
    const opened = createVisualJob(createSeedState(), "Shopfront sketch", now);
    const jobId = opened.visualJobs[0].id;
    const withRef = addVisualReference(opened, jobId, { name: "sketch.png", kind: "sketch", note: "Owner drawing" });
    const job = withRef.visualJobs[0];
    expect(job.visualSimilarity).toBe("not-assessed");
    expect(job.functionalCompleteness).toBe("not-assessed");
    expect(job.stages.find((stage) => stage.id === "visual-analysis")?.state).toBe("blocked");
    expect(job.stages.find((stage) => stage.id === "backend")?.state).toBe("blocked");
    const proof = createSeedState().visualJobs[0];
    expect(proof.functionalCompleteness).toBe("partial");
    expect(proof.stages.find((stage) => stage.id === "visual-compare")?.state).toBe("blocked");
  });

  it("does not mark capability candidates active", () => {
    for (const capability of CAPABILITIES) {
      expect(capability.stages.active).toBe("not-recorded");
      expect(capability.stages.installed).toBe("not-recorded");
    }
    expect(REVIEW_GATES.every((gate) => gate.integration === "blocked" && gate.bytesInWorkspace === false)).toBe(true);
  });

  it("returns an unavailable health report when no endpoint is configured", async () => {
    const health = await observeCore("   ", "2026-10-28T15:00:00.000Z");
    expect(health).toEqual(unavailableHealth("2026-10-28T15:00:00.000Z"));
    expect(health.jobs).toBeNull();
    expect(health.events).toBeNull();
    expect(health.conversationId).toBeNull();
  });
});
