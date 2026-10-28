import { useEffect, useState } from "react";
import { DEPARTMENTS, EXERCISES } from "../app/catalog";
import { duplicateAgent, saveAgent } from "../app/logic";
import { hrefFor } from "../app/routes";
import { useWorkspace } from "../app/store";
import type { AgentDraft } from "../app/types";
import { Field, Monogram, PageHeader, Pill, StringList } from "../ui/bits";

export function Workforce({ agentId }: { agentId?: string }) {
  if (agentId) return <AgentProfile agentId={agentId} />;
  return <Roster />;
}

function Roster() {
  const { state } = useWorkspace();
  const [department, setDepartment] = useState<string>("All");
  const visible = state.agents.filter((agent) => department === "All" || agent.department === department);
  const departments = ["All", ...DEPARTMENTS];

  return (
    <section className="page">
      <PageHeader
        kicker="Workforce"
        title="Identities without invented histories."
        lede="Each card is a draft profile. The display name is not the model. Measured reliability stays unmeasured until a real evaluation is stored by the canonical system."
      />
      <div className="inline wrap" role="group" aria-label="Department">
        {departments.map((item) => (
          <button key={item} type="button" className={item === department ? "btn btn-primary" : "btn"} onClick={() => setDepartment(item)}>
            {item}
          </button>
        ))}
      </div>
      <div className="cards">
        {visible.map((agent) => (
          <a key={agent.id} className="panel agent-card" href={hrefFor("workforce", agent.id)}>
            <Monogram name={agent.displayName} />
            <div>
              <strong>{agent.displayName}</strong>
              <p>{agent.department}</p>
              <p>{agent.specialisation}</p>
              <div className="inline">
                <Pill tone="draft">{agent.status}</Pill>
                <Pill tone="held">Unmeasured</Pill>
              </div>
            </div>
          </a>
        ))}
      </div>
      {visible.length === 0 ? <p className="panel">No drafts in this department. The factory can prepare one after searching existing names.</p> : null}
    </section>
  );
}

function AgentProfile({ agentId }: { agentId: string }) {
  const { state, update } = useWorkspace();
  const agent = state.agents.find((item) => item.id === agentId);
  const snapshot = agent ? JSON.stringify(agent) : "";
  const [form, setForm] = useState<AgentDraft | null>(agent ?? null);
  const [saved, setSaved] = useState("");

  useEffect(() => {
    setForm(agent ? structuredClone(agent) : null);
  }, [snapshot, agent]);

  if (!agent || !form) {
    return (
      <section className="page">
        <PageHeader kicker="Workforce" title="Draft missing" lede="That identity is not in this browser copy." />
        <a className="btn" href="#/workforce">
          Back to roster
        </a>
      </section>
    );
  }

  const patch = (next: Partial<AgentDraft>) => setForm({ ...form, ...next });
  const patchBrain = (next: Partial<AgentDraft["brain"]>) => setForm({ ...form, brain: { ...form.brain, ...next } });

  return (
    <section className="page">
      <PageHeader
        kicker={form.department}
        title={form.displayName}
        lede="Saving writes a new local version. It does not register the agent, attach memory, or record a score."
      />
      <p className="inline">
        <a href="#/workforce">Roster</a>
        <Pill tone="draft">{form.status}</Pill>
        <Pill tone="held">Version {agent.version}</Pill>
        <Pill tone="held">Availability unassigned</Pill>
      </p>
      <form
        className="stack"
        onSubmit={(event) => {
          event.preventDefault();
          update((current) => saveAgent(current, form, "Operator saved the brain profile.", new Date().toISOString()));
          setSaved("Draft saved in this browser.");
        }}
      >
        <section className="panel stack">
          <h2>Identity</h2>
          <div className="inline">
            <Monogram name={form.displayName} />
            <p className="reason">Placeholder monogram. Custom artwork is not stored, and this mark is not a likeness.</p>
          </div>
          <div className="form-grid">
            <Field label="Display name">
              <input value={form.displayName} onChange={(event) => patch({ displayName: event.target.value })} />
            </Field>
            <Field label="Stable id">
              <input value={form.id} readOnly />
            </Field>
            <Field label="Department">
              <input value={form.department} onChange={(event) => patch({ department: event.target.value })} list="departments" />
            </Field>
            <Field label="Status">
              <select value={form.status} onChange={(event) => patch({ status: event.target.value === "proposed" ? "proposed" : "draft" })}>
                <option value="draft">Draft</option>
                <option value="proposed">Proposed</option>
              </select>
            </Field>
          </div>
          <datalist id="departments">
            {DEPARTMENTS.map((item) => (
              <option key={item} value={item} />
            ))}
          </datalist>
          <Field label="Specialisation">
            <textarea value={form.specialisation} onChange={(event) => patch({ specialisation: event.target.value })} />
          </Field>
          <StringList label="Responsibilities" values={form.responsibilities} onChange={(responsibilities) => patch({ responsibilities })} />
          <StringList label="Swarm ids" values={form.swarmIds} onChange={(swarmIds) => patch({ swarmIds })} />
          <Field label="Identity note">
            <textarea value={form.identityNote} onChange={(event) => patch({ identityNote: event.target.value })} />
          </Field>
        </section>
        <section className="panel stack">
          <h2>Brain</h2>
          <fieldset className="stack">
            <legend>Model routing</legend>
            <label className="check">
              <input type="radio" name="brain-model" checked={form.brain.modelMode === "automatic"} onChange={() => patchBrain({ modelMode: "automatic" })} />
              Automatic when the canonical router is connected
            </label>
            <label className="check">
              <input type="radio" name="brain-model" checked={form.brain.modelMode === "pinned"} onChange={() => patchBrain({ modelMode: "pinned" })} />
              Pinned label
            </label>
            <input aria-label="Pinned model label" value={form.brain.pinnedModelLabel} onChange={(event) => patchBrain({ pinnedModelLabel: event.target.value })} />
            <p className="reason">Changing the label keeps the agent id and the version history on this draft.</p>
          </fieldset>
          <StringList label="Fallback labels" values={form.brain.fallbackLabels} onChange={(fallbackLabels) => patchBrain({ fallbackLabels })} />
          <Field label="System prompt">
            <textarea value={form.brain.systemPrompt} onChange={(event) => patchBrain({ systemPrompt: event.target.value })} />
          </Field>
          <Field label="Reasoning workflow">
            <textarea value={form.brain.reasoningWorkflow} onChange={(event) => patchBrain({ reasoningWorkflow: event.target.value })} />
          </Field>
          <StringList
            label="Knowledge collections"
            values={form.brain.knowledgeCollections}
            onChange={(knowledgeCollections) => patchBrain({ knowledgeCollections })}
          />
          <label className="check">
            <input type="checkbox" checked={form.brain.taskScopedMemory} onChange={(event) => patchBrain({ taskScopedMemory: event.target.checked })} />
            Task-scoped memory intended
          </label>
          <label className="check">
            <input
              type="checkbox"
              checked={form.brain.persistentVerifiedMemory}
              onChange={(event) => patchBrain({ persistentVerifiedMemory: event.target.checked })}
            />
            Persistent verified memory intended
          </label>
          <p className="reason">Either checkbox records intent. Neither one creates a memory.</p>
          <Field label="Memory note">
            <textarea value={form.brain.memoryNote} onChange={(event) => patchBrain({ memoryNote: event.target.value })} />
          </Field>
          <StringList label="Skills" values={form.brain.skills} onChange={(skills) => patchBrain({ skills })} />
          <StringList label="Native tools" values={form.brain.nativeTools} onChange={(nativeTools) => patchBrain({ nativeTools })} />
          <StringList label="MCP capabilities" values={form.brain.mcpCapabilities} onChange={(mcpCapabilities) => patchBrain({ mcpCapabilities })} />
          <Field label="Runtime budget note">
            <textarea value={form.brain.budgetNote} onChange={(event) => patchBrain({ budgetNote: event.target.value })} />
          </Field>
          <div className="form-grid">
            <Field label="Filesystem grant">
              <select value={form.brain.filesystem} onChange={(event) => patchBrain({ filesystem: event.target.value as AgentDraft["brain"]["filesystem"] })}>
                <option value="none">None</option>
                <option value="read">Read</option>
                <option value="workspace-write">Workspace write</option>
              </select>
            </Field>
            <Field label="Approval">
              <select value={form.brain.approval} onChange={(event) => patchBrain({ approval: event.target.value === "scoped" ? "scoped" : "required" })}>
                <option value="required">Required</option>
                <option value="scoped">Scoped</option>
              </select>
            </Field>
          </div>
        </section>
        <section className="panel stack">
          <h2>Evaluation</h2>
          <p>Measured reliability: unmeasured. Current job: none.</p>
          {form.brain.evaluationFixtures.length === 0 ? <p>No fixtures queued.</p> : null}
          <ul>
            {form.brain.evaluationFixtures.map((fixture) => (
              <li key={fixture}>{fixture} — not run</li>
            ))}
          </ul>
          <StringList
            label="Unrun fixtures"
            values={form.brain.evaluationFixtures}
            onChange={(evaluationFixtures) => patchBrain({ evaluationFixtures })}
          />
          <p className="reason">Academy exercises can also append a fixture. Adding a name does not run it.</p>
          <ul className="plain">
            {EXERCISES.map((exercise) => (
              <li key={exercise.id}>{exercise.title}</li>
            ))}
          </ul>
          <h3>Local versions</h3>
          <ul className="plain">
            {agent.revisions.map((revision) => (
              <li key={`${revision.version}-${revision.at}`}>
                <strong>v{revision.version}</strong>
                <span>{revision.summary}</span>
              </li>
            ))}
          </ul>
          {agent.improvementNotes.length ? (
            <>
              <h3>Improvement notes</h3>
              <ul>
                {agent.improvementNotes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </>
          ) : null}
        </section>
        <div className="inline">
          <button type="submit" className="btn btn-primary">
            Save draft
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => update((current) => duplicateAgent(current, agent.id, new Date().toISOString()))}
          >
            Duplicate definition
          </button>
          <button type="button" className="btn" disabled>
            Register with Core
          </button>
        </div>
        <p className="reason">Registration is unavailable until owner acceptance and the canonical registry are both in play.</p>
        {saved ? <p>{saved}</p> : null}
      </form>
    </section>
  );
}
