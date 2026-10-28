import { useState } from "react";
import { PROJECT_DOMAINS } from "../app/catalog";
import { createProject, formatSydney } from "../app/logic";
import { hrefFor } from "../app/routes";
import { useWorkspace } from "../app/store";
import type { ProjectDomain } from "../app/types";
import { Field, PageHeader, Pill } from "../ui/bits";

export function Projects({ projectId }: { projectId?: string }) {
  const { state, update } = useWorkspace();
  const [domain, setDomain] = useState<ProjectDomain | "all">("all");
  const [name, setName] = useState("");
  const [summary, setSummary] = useState("");
  const [nextDomain, setNextDomain] = useState<ProjectDomain>("general");
  const selected = state.projects.find((project) => project.id === projectId);
  const visible = state.projects.filter((project) => domain === "all" || project.domain === domain);

  return (
    <section className="page">
      <PageHeader
        kicker="Projects"
        title="Domain workspaces stay off the sidebar."
        lede="Business, trading, game, content, and web work open here. Creating one files a planning note. It does not add a permanent navigation item or start execution."
      />
      <div className="inline wrap" role="group" aria-label="Domain filter">
        <button type="button" className={domain === "all" ? "btn btn-primary" : "btn"} onClick={() => setDomain("all")}>
          All
        </button>
        {PROJECT_DOMAINS.map((item) => (
          <button key={item.id} type="button" className={domain === item.id ? "btn btn-primary" : "btn"} onClick={() => setDomain(item.id)}>
            {item.label}
          </button>
        ))}
      </div>
      <form
        className="panel stack"
        onSubmit={(event) => {
          event.preventDefault();
          update((current) => createProject(current, { name, domain: nextDomain, summary }, new Date().toISOString()));
          setName("");
          setSummary("");
        }}
      >
        <h2>Open a local workspace</h2>
        <div className="form-grid">
          <Field label="Name">
            <input value={name} onChange={(event) => setName(event.target.value)} />
          </Field>
          <Field label="Domain">
            <select value={nextDomain} onChange={(event) => setNextDomain(event.target.value as ProjectDomain)}>
              {PROJECT_DOMAINS.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <Field label="Summary">
          <textarea value={summary} onChange={(event) => setSummary(event.target.value)} />
        </Field>
        <button type="submit" className="btn btn-primary">
          Create workspace
        </button>
      </form>
      <div className="split">
        <section className="panel">
          <h2>Workspaces</h2>
          {visible.length === 0 ? <p>No workspaces in this filter.</p> : null}
          <ul className="plain">
            {visible.map((project) => (
              <li key={project.id}>
                <a href={hrefFor("projects", project.id)}>{project.name}</a>
                <span>{project.domain}</span>
              </li>
            ))}
          </ul>
        </section>
        <section className="panel">
          {selected ? (
            <>
              <h2>{selected.name}</h2>
              <Pill tone="local">{selected.domain}</Pill>
              <p>{selected.summary || "No summary."}</p>
              <p className="reason">Created {formatSydney(selected.createdAt)}.</p>
              <h3>Linked planning notes</h3>
              <ul>
                {state.planning.filter((note) => note.projectId === selected.id).map((note) => (
                  <li key={note.id}>{note.title}</li>
                ))}
              </ul>
              <button type="button" className="btn" disabled>
                Open execution
              </button>
              <p className="reason">Execution is unavailable for every domain in this preview.</p>
            </>
          ) : (
            <p>Select a workspace to read its local summary.</p>
          )}
        </section>
      </div>
    </section>
  );
}
