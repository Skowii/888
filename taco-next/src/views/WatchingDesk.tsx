import { useState } from "react";
import { DESK_DUTIES, FINDING_FIELDS } from "../app/catalog";
import { addDeskNote, updateScout } from "../app/logic";
import { hrefFor } from "../app/routes";
import { useWorkspace } from "../app/store";
import { Field, PageHeader, Pill } from "../ui/bits";
import type { Confidence, ScoutConfig, Severity } from "../app/types";

export function WatchingDesk() {
  const { state } = useWorkspace();
  const masters = state.agents.filter((agent) => agent.department === "Masters");

  return (
    <section className="page">
      <PageHeader
        kicker="Watching Desk"
        title="Scout, classify, route — without a second queue."
        lede="Three scout drafts, three desk duties, and the master drafts share this page. Scouts are not observing. A saved desk note is an operator record, and a route proposal lands in planning notes."
      />
      <div className="layer">
        <h2>Scout layer</h2>
        <div className="cards">
          {state.scouts.map((scout) => (
            <ScoutEditor key={scout.id} scout={scout} />
          ))}
        </div>
      </div>
      <div className="layer">
        <h2>Desk layer</h2>
        <div className="cards">
          {DESK_DUTIES.map((duty) => {
            const agentId =
              duty.id === "analyse" ? "draft.desk.analyst" : duty.id === "prioritise" ? "draft.desk.prioritiser" : "draft.desk.router";
            const match = state.agents.find((item) => item.id === agentId);
            return (
              <article key={duty.id} className="panel">
                <h3>{duty.title}</h3>
                <p>{duty.duty}</p>
                {match ? <a href={hrefFor("workforce", match.id)}>{match.displayName}</a> : <p className="reason">Role draft missing.</p>}
              </article>
            );
          })}
        </div>
      </div>
      <div className="split">
        <section className="panel">
          <h2>Finding record</h2>
          <p>Every future canonical finding needs these fields. This preview has {state.deskNotes.length} operator note{state.deskNotes.length === 1 ? "" : "s"} and no scout findings.</p>
          <ul className="plain">
            {FINDING_FIELDS.map((field) => (
              <li key={field.field}>
                <strong className="mono">{field.field}</strong>
                <span>{field.meaning}</span>
              </li>
            ))}
          </ul>
        </section>
        <section className="panel">
          <h2>Master layer</h2>
          <p>Masters coordinate through Foreman. None of these drafts has a private scheduler.</p>
          <ul className="plain">
            {masters.map((master) => (
              <li key={master.id}>
                <a href={hrefFor("workforce", master.id)}>{master.displayName}</a>
                <span>{master.specialisation}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
      <DeskForm />
      <section className="panel">
        <h2>Operator notes</h2>
        {state.deskNotes.length === 0 ? <p>No operator notes yet.</p> : null}
        <ul className="plain">
          {state.deskNotes.map((note) => (
            <li key={note.id}>
              <div className="inline spread">
                <strong>{note.project}</strong>
                <Pill tone="local">{note.lane}</Pill>
              </div>
              <p>{note.evidence}</p>
              <p className="reason">
                {note.dedupId} · {note.confidence} confidence · {note.severity} severity · {note.classification || "unclassified"} ·{" "}
                {note.priorityGroup || "ungrouped"} · route {note.routeTarget || "unset"}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </section>
  );
}

function ScoutEditor({ scout }: { scout: ScoutConfig }) {
  const { update } = useWorkspace();
  const [mandate, setMandate] = useState(scout.mandate);
  const [authorisedScope, setScope] = useState(scout.authorisedScope);
  const [cadence, setCadence] = useState(scout.cadence);
  const [scheduleNote, setSchedule] = useState(scout.scheduleNote);
  const [saved, setSaved] = useState(false);

  return (
    <form
      className="panel stack"
      onSubmit={(event) => {
        event.preventDefault();
        update((current) => updateScout(current, scout.id, { mandate, authorisedScope, cadence, scheduleNote }));
        setSaved(true);
      }}
    >
      <h3>{scout.title}</h3>
      <Pill tone="held">Not observing</Pill>
      <Field label="Mandate">
        <textarea value={mandate} onChange={(event) => setMandate(event.target.value)} />
      </Field>
      <Field label="Authorised scope">
        <textarea value={authorisedScope} onChange={(event) => setScope(event.target.value)} placeholder="No roots mounted" />
      </Field>
      <Field label="Cadence preference">
        <select value={cadence} onChange={(event) => setCadence(event.target.value as ScoutConfig["cadence"])}>
          <option value="event-driven">Event-driven</option>
          <option value="bounded-schedule">Bounded schedule</option>
        </select>
      </Field>
      <Field label="Schedule note">
        <input value={scheduleNote} onChange={(event) => setSchedule(event.target.value)} />
      </Field>
      <div className="inline">
        <button type="submit" className="btn btn-primary">
          Save scout draft
        </button>
        <button type="button" className="btn" disabled>
          Discover now
        </button>
      </div>
      <p className="reason">Discover now is unavailable. No authorised root is mounted, and this preview will not start inference.</p>
      {saved ? <p>Scout draft saved in this browser.</p> : null}
    </form>
  );
}

function DeskForm() {
  const { state, update } = useWorkspace();
  const [source, setSource] = useState("operator");
  const [evidence, setEvidence] = useState("");
  const [project, setProject] = useState("");
  const [dedupId, setDedup] = useState("");
  const [confidence, setConfidence] = useState<Confidence>("medium");
  const [severity, setSeverity] = useState<Severity>("info");
  const [classification, setClassification] = useState("");
  const [priorityGroup, setPriority] = useState("");
  const [routeTarget, setRoute] = useState("");
  const [message, setMessage] = useState("");
  const masters = state.agents.filter((agent) => agent.department === "Masters");

  return (
    <form
      className="panel stack"
      onSubmit={(event) => {
        event.preventDefault();
        const result = { current: "" };
        update((current) => {
          const next = addDeskNote(
            current,
            {
              source,
              evidence,
              confidence,
              severity,
              project,
              time: new Date().toISOString(),
              dedupId,
              classification,
              priorityGroup,
              routeTarget,
            },
            new Date().toISOString(),
          );
          if (!next.ok) {
            result.current = next.reason;
            return current;
          }
          result.current = routeTarget ? "Operator note saved. A planning-note route proposal was filed." : "Operator note saved.";
          return next.state;
        });
        setMessage(result.current);
        if (result.current.startsWith("Operator")) {
          setEvidence("");
          setDedup("");
        }
      }}
    >
      <h2>Record an operator note</h2>
      <p className="reason">This form writes a local note. It does not claim a scout discovered the evidence.</p>
      <div className="form-grid">
        <Field label="Source">
          <input value={source} onChange={(event) => setSource(event.target.value)} />
        </Field>
        <Field label="Project">
          <input value={project} onChange={(event) => setProject(event.target.value)} />
        </Field>
        <Field label="Deduplication identity">
          <input value={dedupId} onChange={(event) => setDedup(event.target.value)} />
        </Field>
        <Field label="Confidence">
          <select value={confidence} onChange={(event) => setConfidence(event.target.value as Confidence)}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </Field>
        <Field label="Severity">
          <select value={severity} onChange={(event) => setSeverity(event.target.value as Severity)}>
            <option value="info">Info</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </Field>
        <Field label="Classification">
          <input value={classification} onChange={(event) => setClassification(event.target.value)} />
        </Field>
        <Field label="Priority group">
          <input value={priorityGroup} onChange={(event) => setPriority(event.target.value)} />
        </Field>
        <Field label="Route proposal">
          <select value={routeTarget} onChange={(event) => setRoute(event.target.value)}>
            <option value="">Leave unrouted</option>
            {masters.map((master) => (
              <option key={master.id} value={master.id}>
                {master.displayName}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <Field label="Evidence">
        <textarea value={evidence} onChange={(event) => setEvidence(event.target.value)} />
      </Field>
      <div className="inline">
        <button type="submit" className="btn btn-primary">
          Save operator note
        </button>
        <button type="button" className="btn" disabled>
          Enqueue canonical job
        </button>
      </div>
      <p className="reason">Enqueue is unavailable because the canonical job system is not connected.</p>
      {message ? <p>{message}</p> : null}
    </form>
  );
}
