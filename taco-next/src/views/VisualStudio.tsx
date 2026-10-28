import { useEffect, useState } from "react";
import { VISUAL_STAGE_ORDER } from "../app/catalog";
import { addVisualReference, createVisualJob, formatSydney, saveVisualSpec, setBackendApplicability } from "../app/logic";
import { hrefFor } from "../app/routes";
import { useWorkspace } from "../app/store";
import type { VisualJob, VisualReference } from "../app/types";
import { Field, PageHeader, Pill, stageTone } from "../ui/bits";

export function VisualStudio({ jobId }: { jobId?: string }) {
  const { state, update } = useWorkspace();
  const [title, setTitle] = useState("");
  const selected = state.visualJobs.find((job) => job.id === jobId) ?? state.visualJobs[0];

  return (
    <section className="page">
      <PageHeader
        kicker="Visual-to-Software Studio"
        title="A reference is not a finished product."
        lede="The same nine-stage workflow covers future sites, applications, and business tools. Visual similarity and functional completeness are tracked apart. This preview does not generate code from an image."
      />
      <div className="split">
        <aside className="panel stack">
          <form
            className="stack"
            onSubmit={(event) => {
              event.preventDefault();
              update((current) => createVisualJob(current, title, new Date().toISOString()));
              setTitle("");
            }}
          >
            <Field label="New workflow">
              <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Project name" />
            </Field>
            <button type="submit" className="btn btn-primary">
              Start workflow
            </button>
          </form>
          <ul className="plain">
            {state.visualJobs.map((job) => (
              <li key={job.id}>
                <a href={hrefFor("visual", job.id)} aria-current={selected?.id === job.id ? "true" : undefined}>
                  {job.title}
                </a>
                <span>{job.functionalCompleteness}</span>
              </li>
            ))}
          </ul>
        </aside>
        <div>{selected ? <JobDetail job={selected} /> : <p className="panel">No workflow is stored.</p>}</div>
      </div>
    </section>
  );
}

function JobDetail({ job }: { job: VisualJob }) {
  const { update } = useWorkspace();
  const [spec, setSpec] = useState(job.spec);
  const [refName, setRefName] = useState("");
  const [refKind, setRefKind] = useState<VisualReference["kind"]>("sketch");
  const [refNote, setRefNote] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setSpec(job.spec);
    setPreview(null);
  }, [job.id, job.spec]);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const analysis = job.stages.find((stage) => stage.id === "visual-analysis");

  return (
    <div className="stack">
      <section className="panel stack">
        <div className="inline spread">
          <h2>{job.title}</h2>
          <Pill tone="held">Reusable workflow</Pill>
        </div>
        <p>{job.brief || "No written brief yet."}</p>
        <p className="reason">
          Opened {formatSydney(job.createdAt)}. Visual similarity: {job.visualSimilarity}. Functional completeness: {job.functionalCompleteness}.
        </p>
        <ol className="rail">
          {VISUAL_STAGE_ORDER.map((meta, index) => {
            const stage = job.stages.find((item) => item.id === meta.id);
            return (
              <li key={meta.id}>
                <span className="mono">{index + 1}</span>
                <div>
                  <strong>{meta.title}</strong>
                  <p>{meta.detail}</p>
                  <p>{stage?.evidence}</p>
                </div>
                <Pill tone={stageTone(stage?.state ?? "pending")}>{stage?.state ?? "pending"}</Pill>
              </li>
            );
          })}
        </ol>
      </section>
      <section className="panel stack">
        <h2>References</h2>
        <p className="reason">Session previews stay in memory for this view. They are not analysed.</p>
        {preview ? <img className="preview" src={preview} alt="Session preview of the attached reference" /> : null}
        <ul>
          {job.references.map((reference) => (
            <li key={reference.id}>
              {reference.kind}: {reference.name} — {reference.note}
            </li>
          ))}
        </ul>
        <form
          className="stack"
          onSubmit={(event) => {
            event.preventDefault();
            update((current) => addVisualReference(current, job.id, { name: refName, kind: refKind, note: refNote }));
            setMessage("Reference recorded. Visual analysis remains blocked.");
            setRefName("");
            setRefNote("");
          }}
        >
          <div className="form-grid">
            <Field label="Name or URL">
              <input value={refName} onChange={(event) => setRefName(event.target.value)} />
            </Field>
            <Field label="Kind">
              <select value={refKind} onChange={(event) => setRefKind(event.target.value as VisualReference["kind"])}>
                <option value="photograph">Photograph</option>
                <option value="sketch">Sketch</option>
                <option value="screenshot">Screenshot</option>
                <option value="website">Website</option>
                <option value="note">Note</option>
              </select>
            </Field>
          </div>
          <Field label="Note">
            <input value={refNote} onChange={(event) => setRefNote(event.target.value)} />
          </Field>
          <Field label="Image file, session only">
            <input
              type="file"
              accept="image/*"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (!file) return;
                if (preview) URL.revokeObjectURL(preview);
                setPreview(URL.createObjectURL(file));
                setRefName(file.name);
                setRefKind("screenshot");
              }}
            />
          </Field>
          <div className="inline">
            <button type="submit" className="btn btn-primary">
              Record reference
            </button>
            <button type="button" className="btn" disabled>
              Analyse with a vision model
            </button>
          </div>
          <p className="reason">{analysis?.evidence}</p>
        </form>
      </section>
      <form
        className="panel stack"
        onSubmit={(event) => {
          event.preventDefault();
          update((current) => saveVisualSpec(current, job.id, spec));
          setMessage("Specification saved on this workflow.");
        }}
      >
        <h2>Design specification</h2>
        <Field label="Purpose">
          <textarea value={spec.purpose} onChange={(event) => setSpec({ ...spec, purpose: event.target.value })} />
        </Field>
        <Field label="Surfaces, one per line">
          <textarea value={spec.surfaces.join("\n")} onChange={(event) => setSpec({ ...spec, surfaces: event.target.value.split("\n") })} />
        </Field>
        <Field label="Constraints, one per line">
          <textarea
            value={spec.constraints.join("\n")}
            onChange={(event) => setSpec({ ...spec, constraints: event.target.value.split("\n") })}
          />
        </Field>
        <Field label="Non-goals, one per line">
          <textarea value={spec.nonGoals.join("\n")} onChange={(event) => setSpec({ ...spec, nonGoals: event.target.value.split("\n") })} />
        </Field>
        <div className="inline">
          <button type="submit" className="btn btn-primary">
            Save specification
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => update((current) => setBackendApplicability(current, job.id, false))}
          >
            Mark backend out of scope
          </button>
          <button type="button" className="btn" onClick={() => update((current) => setBackendApplicability(current, job.id, true))}>
            Keep backend in scope
          </button>
        </div>
        <p className="reason">Backend in scope stays blocked until Core is connected. Out of scope means a static reconstruction, not a finished integration.</p>
        {message ? <p>{message}</p> : null}
      </form>
    </div>
  );
}
