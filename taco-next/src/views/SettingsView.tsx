import { useState } from "react";
import { observeCore, validateHealthUrl } from "../app/coreAdapter";
import { WORKSPACE_OBSERVATION } from "../app/environment";
import { formatSydney, importWorkspace, updateSettings } from "../app/logic";
import { useWorkspace } from "../app/store";
import type { CoreHealth } from "../app/types";
import { Field, PageHeader, Pill } from "../ui/bits";

export function SettingsView() {
  const { state, update, replace, reset, warning, storageError } = useWorkspace();
  const [health, setHealth] = useState<CoreHealth | null>(null);
  const [busy, setBusy] = useState(false);
  const [importError, setImportError] = useState("");
  const [confirmReset, setConfirmReset] = useState(false);
  const urlError = validateHealthUrl(state.settings.coreHealthUrl);

  return (
    <section className="page">
      <PageHeader
        kicker="Settings & Diagnostics"
        title="What this preview can see."
        lede="Live TACO, live Core, and the Links installer were not modified. No sudo, restart, deployment, or worker launch was performed while this candidate was built."
      />
      <section className="panel stack">
        <h2>Observation</h2>
        <ul className="plain">
          <li>
            <strong>Canonical path</strong>
            <span className="mono">{WORKSPACE_OBSERVATION.canonicalPath}</span>
            <Pill tone="blocked">Not mounted</Pill>
          </li>
          <li>
            <strong>Reported director</strong>
            <span className="mono">{WORKSPACE_OBSERVATION.reportedDirector}</span>
            <Pill tone="blocked">Unverified</Pill>
          </li>
          <li>
            <strong>This workspace</strong>
            <span>
              {WORKSPACE_OBSERVATION.githubWorkspace} @ {WORKSPACE_OBSERVATION.workspaceBase}
            </span>
          </li>
          <li>
            <strong>Public repositories listed</strong>
            <span>{WORKSPACE_OBSERVATION.publicReposSeen.join(", ")}</span>
          </li>
        </ul>
        <p>{WORKSPACE_OBSERVATION.note}</p>
        {warning ? <p>{warning}</p> : null}
        {storageError ? <p>{storageError}</p> : null}
      </section>
      <section className="panel stack">
        <h2>Read-only health check</h2>
        <Field label="Core health URL">
          <input
            value={state.settings.coreHealthUrl}
            placeholder="Leave empty to record unavailable"
            onChange={(event) => update((current) => updateSettings(current, { coreHealthUrl: event.target.value }))}
          />
        </Field>
        {urlError ? <p className="reason">{urlError}</p> : null}
        <button
          type="button"
          className="btn btn-primary"
          disabled={busy || Boolean(urlError)}
          onClick={() => {
            setBusy(true);
            void observeCore(state.settings.coreHealthUrl).then((result) => {
              setHealth(result);
              setBusy(false);
            });
          }}
        >
          Check health
        </button>
        {health ? (
          <div data-testid="health-result">
            <p>
              <Pill tone={health.status === "observed" ? "pending" : "blocked"}>{health.status}</Pill>
            </p>
            <p>{health.detail}</p>
            <p className="reason">
              Observed {formatSydney(health.observedAt)}. Jobs: none attached. Events: none attached. Conversation id: none attached.
            </p>
          </div>
        ) : null}
      </section>
      <section className="panel stack">
        <h2>Display</h2>
        <Field label="Density">
          <select
            value={state.settings.density}
            onChange={(event) =>
              update((current) => updateSettings(current, { density: event.target.value === "compact" ? "compact" : "comfortable" }))
            }
          >
            <option value="comfortable">Comfortable</option>
            <option value="compact">Compact</option>
          </select>
        </Field>
      </section>
      <section className="panel stack">
        <h2>Draft file</h2>
        <div className="inline">
          <button
            type="button"
            className="btn"
            onClick={() => {
              const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
              const url = URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.href = url;
              link.download = "taco-next-drafts.json";
              link.click();
              URL.revokeObjectURL(url);
            }}
          >
            Export drafts
          </button>
          <label className="btn">
            Import drafts
            <input
              className="sr-only"
              type="file"
              accept="application/json"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (!file) return;
                void file.text().then((text) => {
                  const result = importWorkspace(text);
                  if (!result.ok) {
                    setImportError(result.error);
                    return;
                  }
                  setImportError("");
                  replace(result.state);
                });
              }}
            />
          </label>
        </div>
        {importError ? <p>{importError}</p> : null}
        {confirmReset ? (
          <button
            type="button"
            className="btn"
            onClick={() => {
              reset();
              setConfirmReset(false);
            }}
          >
            Confirm reset of local drafts
          </button>
        ) : (
          <button type="button" className="btn" onClick={() => setConfirmReset(true)}>
            Reset local drafts
          </button>
        )}
        <p className="reason">Reset restores the seeded role drafts in this browser. It does not touch another system.</p>
      </section>
      <section className="panel">
        <h2>CLI</h2>
        <p>The z3 interactive CLI source is not in this workspace. Existing commands could not be enumerated. Shared conversation, job, and event ids: none. Review of z3-interactive-r2 remains mandatory before any frozen CLI bytes are integrated.</p>
      </section>
      <section className="panel stack" data-testid="reconciliation">
        <h2>Reconciliation</h2>
        <p>
          PR #1 was reviewed in this workspace and was not merged. <span className="mono">/mnt/AI/HEX13-vNext</span> was checked
          again and is still absent, so live TACO features were not classified from source.
        </p>
        <p>
          <span className="mono">taco-core-r1</span>, <span className="mono">taco-cockpit-r1</span>, and{" "}
          <span className="mono">z3-interactive-r2</span> have no bytes and no hashes here. Their independent review is blocked.
          Foreman R3 was not opened. No integration preview was built.
        </p>
        <p className="reason">Browser drafts under taco-ng.workspace.v1 survive refresh on this origin. They are not Core records.</p>
      </section>
    </section>
  );
}
