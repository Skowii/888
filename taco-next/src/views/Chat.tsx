import { useState } from "react";
import { appendChatLine, createChat, fileChatAsPlanning, formatSydney, updateChat } from "../app/logic";
import { hrefFor } from "../app/routes";
import { useWorkspace } from "../app/store";
import { Field, PageHeader, Pill } from "../ui/bits";

export function Chat({ chatId }: { chatId?: string }) {
  const { state, update } = useWorkspace();
  const selected = state.chats.find((chat) => chat.id === chatId) ?? state.chats[0];
  const [draft, setDraft] = useState("");
  const [notice, setNotice] = useState("");

  return (
    <section className="page">
      <PageHeader
        kicker="Z3R0TH Chat"
        title="Objectives stay on this machine's browser."
        lede="Natural conversation, streaming, and live tool calls need the canonical conversation service. That service is not connected, so this screen stores operator text and model preferences only."
      />
      <div className="chat-layout">
        <aside className="panel">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              update((current) => createChat(current));
            }}
          >
            New objective
          </button>
          {state.chats.length === 0 ? <p>No local conversations yet.</p> : null}
          <ul className="plain">
            {state.chats.map((chat) => (
              <li key={chat.id}>
                <a href={hrefFor("chat", chat.id)} aria-current={selected?.id === chat.id ? "true" : undefined}>
                  {chat.title}
                </a>
              </li>
            ))}
          </ul>
        </aside>
        <div className="panel">
          {selected ? (
            <>
              <div className="form-grid">
                <Field label="Title">
                  <input
                    value={selected.title}
                    onChange={(event) => update((current) => updateChat(current, selected.id, { title: event.target.value }))}
                  />
                </Field>
                <Field label="Agent draft">
                  <select
                    value={selected.agentId ?? ""}
                    onChange={(event) =>
                      update((current) => updateChat(current, selected.id, { agentId: event.target.value || null }))
                    }
                  >
                    <option value="">Unassigned</option>
                    {state.agents.map((agent) => (
                      <option key={agent.id} value={agent.id}>
                        {agent.displayName}
                      </option>
                    ))}
                  </select>
                </Field>
                <fieldset className="stack">
                  <legend>Model preference</legend>
                  <label className="check">
                    <input
                      type="radio"
                      name="model-mode"
                      checked={selected.modelMode === "automatic"}
                      onChange={() => update((current) => updateChat(current, selected.id, { modelMode: "automatic" }))}
                    />
                    Automatic, when a router exists
                  </label>
                  <label className="check">
                    <input
                      type="radio"
                      name="model-mode"
                      checked={selected.modelMode === "pinned"}
                      onChange={() => update((current) => updateChat(current, selected.id, { modelMode: "pinned" }))}
                    />
                    Pinned label
                  </label>
                  <input
                    aria-label="Pinned model label"
                    value={selected.modelLabel}
                    placeholder="Label only"
                    onChange={(event) => update((current) => updateChat(current, selected.id, { modelLabel: event.target.value }))}
                  />
                  <p className="reason">The label is stored. No model process starts.</p>
                </fieldset>
                <fieldset className="stack" disabled>
                  <legend>Swarm</legend>
                  <select aria-label="Swarm" defaultValue="">
                    <option value="">No swarm registered</option>
                  </select>
                  <p className="reason">Reviewed swarm templates are not in this workspace. Nothing can be activated from here.</p>
                </fieldset>
              </div>
              <div className="transcript" aria-live="polite">
                <p className="system-line">
                  Core conversation id: unavailable. Streaming, tool calls, cancellation, and shared z3 history are unavailable on this screen.
                </p>
                {selected.lines.map((line) => (
                  <article key={line.id} className="operator-line">
                    <header>
                      <Pill tone="local">Operator</Pill>
                      <span>{formatSydney(line.at)}</span>
                    </header>
                    <p>{line.text}</p>
                  </article>
                ))}
              </div>
              <form
                className="composer"
                onSubmit={(event) => {
                  event.preventDefault();
                  update((current) => appendChatLine(current, selected.id, draft, new Date().toISOString()));
                  setDraft("");
                  setNotice("Line kept in this browser conversation.");
                }}
              >
                <label className="field">
                  <span>Objective</span>
                  <textarea value={draft} onChange={(event) => setDraft(event.target.value)} />
                </label>
                <div className="inline">
                  <button type="submit" className="btn btn-primary">
                    Keep line
                  </button>
                  <button
                    type="button"
                    className="btn"
                    onClick={() => {
                      if (selected.lines.length === 0) {
                        setNotice("Write a line before filing it as planning.");
                        return;
                      }
                      update((current) => fileChatAsPlanning(current, selected.id, new Date().toISOString()));
                      setNotice("Latest line filed as a planning note.");
                    }}
                  >
                    File latest line as planning
                  </button>
                  <button type="button" className="btn" disabled>
                    Send to Core
                  </button>
                </div>
                <p className="reason">Send to Core is unavailable until a reviewed conversation contract is connected.</p>
                {notice ? <p>{notice}</p> : null}
              </form>
            </>
          ) : (
            <p>Create an objective to write locally. The transcript will contain your lines only.</p>
          )}
        </div>
      </div>
    </section>
  );
}
