import { NEXT_ACTIONS, PRINCIPLES, REVIEW_GATES, WORKSTREAMS } from "../app/catalog";
import { WORKSPACE_OBSERVATION } from "../app/environment";
import { formatSydney } from "../app/logic";
import { hrefFor } from "../app/routes";
import { useWorkspace } from "../app/store";
import { PageHeader, Pill } from "../ui/bits";

export function CommandCentre() {
  const { state } = useWorkspace();
  const proof = state.visualJobs.find((job) => job.id === "visual.taco-ng");

  return (
    <section className="page">
      <PageHeader
        kicker="Command Centre"
        title="One floor. Nothing executing."
        lede="This preview keeps draft identities, planning notes, and the visual-to-software workflow in the browser. It has no path into Foreman, the model router, or the canonical job system."
      />
      <div className="banner" data-testid="mount-banner">
        <strong>{WORKSPACE_OBSERVATION.canonicalPath}</strong> was not mounted. Reported director{" "}
        <span className="mono">{WORKSPACE_OBSERVATION.reportedDirector}</span> is unverified. Workspace base{" "}
        <span className="mono">{WORKSPACE_OBSERVATION.workspaceBase}</span> on {WORKSPACE_OBSERVATION.githubWorkspace}.
      </div>
      <div className="stats">
        <article className="stat">
          <p>Core health</p>
          <strong>Unavailable</strong>
          <span>No endpoint configured</span>
        </article>
        <article className="stat">
          <p>Role drafts</p>
          <strong>{state.agents.length}</strong>
          <span>Unmeasured, unregistered</span>
        </article>
        <article className="stat">
          <p>Planning notes</p>
          <strong>{state.planning.length}</strong>
          <span>Local to this browser</span>
        </article>
        <article className="stat">
          <p>Execution jobs</p>
          <strong>Unavailable</strong>
          <span>Canonical feed closed</span>
        </article>
      </div>
      <div className="split">
        <section className="panel">
          <h2>Single system</h2>
          <ul className="principles">
            {PRINCIPLES.map((item) => (
              <li key={item.name}>
                <strong>{item.name}</strong>
                <span>{item.status}</span>
              </li>
            ))}
          </ul>
        </section>
        <section className="panel">
          <h2>Review gates</h2>
          <ul className="gate-list">
            {REVIEW_GATES.map((gate) => (
              <li key={gate.id}>
                <div className="inline spread">
                  <span className="mono">{gate.id}</span>
                  <Pill tone="blocked">Blocked</Pill>
                </div>
                <p>{gate.reportedState} Bytes are absent from this workspace.</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
      <div className="split">
        <section className="panel">
          <h2>Proof workflow</h2>
          {proof ? (
            <>
              <p>
                {proof.title} · functional completeness {proof.functionalCompleteness} · visual similarity {proof.visualSimilarity}
              </p>
              <p className="reason">Opened {formatSydney(proof.createdAt)}.</p>
              <a className="btn btn-primary" href={hrefFor("visual", proof.id)}>
                Open Visual Studio
              </a>
            </>
          ) : (
            <p>The proof workflow record is missing from this browser copy.</p>
          )}
        </section>
        <section className="panel">
          <h2>Workstreams</h2>
          <ul className="plain">
            {WORKSTREAMS.map((stream) => (
              <li key={stream.id}>
                <strong>
                  {stream.id}. {stream.name}
                </strong>
                <span className="mono">{stream.output}</span>
                <span>{stream.status}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
      <section className="panel">
        <h2>Highest-impact next actions</h2>
        <ol className="actions">
          {NEXT_ACTIONS.map((action) => (
            <li key={action.title}>
              <strong>{action.title}</strong>
              <p>{action.detail}</p>
            </li>
          ))}
        </ol>
      </section>
    </section>
  );
}
