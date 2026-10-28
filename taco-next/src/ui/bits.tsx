import type { ReactNode } from "react";
import type { StageState } from "../app/types";

export function PageHeader({ kicker, title, lede }: { kicker: string; title: string; lede: string }) {
  return (
    <header className="page-head">
      <p className="kicker">{kicker}</p>
      <h1>{title}</h1>
      <p className="lede">{lede}</p>
    </header>
  );
}

export function Pill({ tone, children }: { tone: string; children: ReactNode }) {
  return <span className={`pill tone-${tone}`}>{children}</span>;
}

export function stageTone(state: StageState): string {
  if (state === "recorded") return "recorded";
  if (state === "blocked") return "blocked";
  if (state === "not-applicable") return "held";
  return "pending";
}

export function Monogram({ name }: { name: string }) {
  const letters = name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
  const hue = [...name].reduce((sum, char) => sum + char.charCodeAt(0), 0) % 360;
  return (
    <span className="monogram" style={{ background: `hsl(${hue} 24% 26%)` }} title="Placeholder monogram">
      {letters || "AG"}
    </span>
  );
}

export function StringList({
  label,
  values,
  onChange,
}: {
  label: string;
  values: string[];
  onChange: (next: string[]) => void;
}) {
  return (
    <fieldset className="stack">
      <legend>{label}</legend>
      {values.map((value, index) => (
        <div className="inline" key={`${label}-${index}`}>
          <input
            aria-label={`${label} ${index + 1}`}
            value={value}
            onChange={(event) => {
              const next = [...values];
              next[index] = event.target.value;
              onChange(next);
            }}
          />
          <button type="button" className="btn" onClick={() => onChange(values.filter((_, item) => item !== index))}>
            Remove
          </button>
        </div>
      ))}
      <button type="button" className="btn" onClick={() => onChange([...values, ""])}>
        Add
      </button>
    </fieldset>
  );
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
    </label>
  );
}
