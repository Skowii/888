import { INTEGRATION_PROOF } from "../app/catalog";
import { formatSydney } from "../app/logic";
import { useWorkspace } from "../app/store";
import { PageHeader, Pill } from "../ui/bits";

export function Jobs() {
  const { state } = useWorkspace();

  return (
    <section className="page">
      <PageHeader
        kicker="Jobs & Approvals"
        title="Planning stays separate from execution."
        lede="Planning notes live in this browser. The execution lane is the canonical job feed, and that feed is unavailable. Foreman does not read the planning column."
      />
      <div className="split">
        <section className="panel" data-testid="planning-lane">
          <div className="inline spread">
            <h2>Planning</h2>
            <Pill tone="local">Local notes</Pill>
          </div>
          {state.planning.length === 0 ? (
            <p>No planning notes yet. Chat, the factory, the desk, and Visual Studio can file one.</p>
          ) : (
            <ul className="plain">
              {state.planning.map((note) => (
                <li key={note.id}>
                  <div className="inline spread">
                    <strong>{note.title}</strong>
                    <Pill tone="local">{note.source}</Pill>
                  </div>
                  <p>{note.detail}</p>
                  <p className="reason">
                    {formatSydney(note.createdAt)} · {note.lane} · {note.id}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
        <section className="panel" data-testid="execution-lane">
          <div className="inline spread">
            <h2>Execution</h2>
            <Pill tone="blocked">Unavailable</Pill>
          </div>
          <p>Canonical job and event records are not connected. There is no job id and no event id to show.</p>
          <button type="button" className="btn" disabled>
            Refresh canonical jobs
          </button>
          <p className="reason">Independent review of taco-core-r1 is still required before this preview treats a response as execution.</p>
          <h3>Approvals</h3>
          <p>No approval request is loaded. This screen cannot grant approval.</p>
        </section>
      </div>
      <section className="panel">
        <h2>Integration proof, still closed</h2>
        <ul className="plain">
          {INTEGRATION_PROOF.map((item) => (
            <li key={item.id}>
              <div className="inline spread">
                <strong>{item.label}</strong>
                <Pill tone="blocked">Blocked</Pill>
              </div>
              <p>{item.reason}</p>
            </li>
          ))}
        </ul>
      </section>
    </section>
  );
}
