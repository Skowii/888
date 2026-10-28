import { useState } from "react";
import { EXERCISES } from "../app/catalog";
import { addFixture, attachImprovement, createAgentDraft, searchDrafts } from "../app/logic";
import { hrefFor } from "../app/routes";
import { useWorkspace } from "../app/store";
import { Field, PageHeader } from "../ui/bits";

const SCHEMA = [
  ["Identity", "Stable id and display name stay put when the model label changes."],
  ["Appearance", "Optional. This preview stores a generated monogram only."],
  ["Department and swarms", "Membership is a list of ids. An empty list means none assigned."],
  ["Model", "Automatic or a pinned label, plus fallback labels. Labels are not a live router."],
  ["Prompt", "System prompt and reasoning workflow, empty until written."],
  ["Knowledge", "Collection names. Indexing is not performed here."],
  ["Memory", "Task-scoped and persistent-verified intents. No memory text is invented."],
  ["Skills and tools", "Skill names, native CLI tools, and MCP capability names."],
  ["Limits", "Filesystem grant, approval requirement, and a budget note."],
  ["Evidence", "Evaluation fixtures, local versions, and improvement notes. Measured performance stays null."],
] as const;

export function FactoryAcademy() {
  const { state, update } = useWorkspace();
  const [gap, setGap] = useState("");
  const [searched, setSearched] = useState("");
  const [note, setNote] = useState("");
  const [target, setTarget] = useState("");
  const [message, setMessage] = useState("");
  const [agentId, setAgentId] = useState(state.agents[0]?.id ?? "");
  const [exercise, setExercise] = useState<string>(EXERCISES[0].title);
  const result = searched ? searchDrafts(state.agents, searched) : null;

  return (
    <section className="page">
      <PageHeader
        kicker="Agent Factory & Training Academy"
        title="Search first. Draft second. Activate never, from here."
        lede="A definition is a versioned browser draft. Certification, registration, and weight updates stay closed. Exercises can be attached as unrun fixtures."
      />
      <section className="panel stack">
        <h2>Capability gap</h2>
        <Field label="Describe the missing capability">
          <textarea value={gap} onChange={(event) => setGap(event.target.value)} />
        </Field>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            setSearched(gap);
            setMessage("");
          }}
        >
          Search existing drafts
        </button>
        {result?.status === "short" ? <p>Enter at least 3 characters so the search is meaningful.</p> : null}
        {result?.status === "matches" ? (
          <div className="stack">
            <p>Matching drafts. A new specialist is withheld while these exist.</p>
            <ul className="plain">
              {result.agents.map((agent) => (
                <li key={agent.id}>
                  <label className="check">
                    <input type="radio" name="improve" checked={target === agent.id} onChange={() => setTarget(agent.id)} />
                    {agent.displayName}
                  </label>
                  <span>{agent.specialisation}</span>
                </li>
              ))}
            </ul>
            <Field label="Improvement note">
              <textarea value={note} onChange={(event) => setNote(event.target.value)} />
            </Field>
            <button
              type="button"
              className="btn"
              onClick={() => {
                if (!target) {
                  setMessage("Choose the draft to improve.");
                  return;
                }
                update((current) => attachImprovement(current, target, note, new Date().toISOString()));
                setMessage("Improvement note stored on the draft and filed as planning.");
                setNote("");
              }}
            >
              Attach improvement
            </button>
          </div>
        ) : null}
        {result?.status === "none" ? (
          <div className="stack">
            <p>No draft matches. A new definition is justified only for this gap.</p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                update((current) =>
                  createAgentDraft(
                    current,
                    { displayName: gap.trim().slice(0, 80), specialisation: gap.trim(), department: "Specialists" },
                    new Date().toISOString(),
                  ),
                );
                setMessage("New draft created. It is unregistered and unmeasured.");
              }}
            >
              Draft a new definition
            </button>
          </div>
        ) : null}
        {message ? <p>{message}</p> : null}
        <button type="button" className="btn" disabled>
          Certify and register
        </button>
        <p className="reason">Certification evidence is empty. Owner acceptance is not recorded.</p>
      </section>
      <section className="panel stack">
        <h2>Training Academy</h2>
        <p>Training here means knowledge, skills, practice, and measured evaluation. Weight fine-tuning is a separate future decision and is unavailable.</p>
        <div className="form-grid">
          <Field label="Draft">
            <select value={agentId} onChange={(event) => setAgentId(event.target.value)}>
              {state.agents.map((agent) => (
                <option key={agent.id} value={agent.id}>
                  {agent.displayName}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Exercise">
            <select value={exercise} onChange={(event) => setExercise(event.target.value)}>
              {EXERCISES.map((item) => (
                <option key={item.id} value={item.title}>
                  {item.title}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <div className="inline">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              update((current) => addFixture(current, agentId, exercise, new Date().toISOString()));
              setMessage(`Fixture “${exercise}” added as not run.`);
            }}
          >
            Add unrun fixture
          </button>
          <button type="button" className="btn" disabled>
            Run exercise
          </button>
          <button type="button" className="btn" disabled>
            Start fine-tune
          </button>
        </div>
        <p className="reason">Run and fine-tune are unavailable. Model Lab and the evaluation system are not connected.</p>
        {agentId ? (
          <p>
            <a href={hrefFor("workforce", agentId)}>Open the selected profile</a>
          </p>
        ) : null}
      </section>
      <section className="panel">
        <h2>Brain profile schema</h2>
        <ul className="plain">
          {SCHEMA.map(([name, rule]) => (
            <li key={name}>
              <strong>{name}</strong>
              <span>{rule}</span>
            </li>
          ))}
        </ul>
      </section>
    </section>
  );
}
