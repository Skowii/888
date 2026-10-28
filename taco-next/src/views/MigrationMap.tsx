import { MIGRATION_ROWS } from "../app/catalog";
import { setMigrationIntent } from "../app/logic";
import { useWorkspace } from "../app/store";
import type { ImportIntent } from "../app/types";
import { PageHeader, Pill } from "../ui/bits";

const INTENTS: { id: ImportIntent; label: string }[] = [
  { id: "undecided", label: "Undecided" },
  { id: "import-later", label: "Import after inspection" },
  { id: "hold", label: "Hold in legacy" },
  { id: "inspect-before-drop", label: "Inspect before dropping" },
];

export function MigrationMap() {
  const { state, update } = useWorkspace();

  return (
    <section className="page">
      <PageHeader
        kicker="Migration map"
        title="Legacy TACO was not opened."
        lede="Nothing in the legacy application is marked obsolete, duplicated, or ready to import. These rows are the inspection checklist. Choosing an intent stores a local preference and deletes nothing."
      />
      <div className="banner">Legacy source expected at /mnt/AI/HEX13-vNext was absent, so route-level inventory is still ahead.</div>
      <div className="table-wrap panel">
        <table className="table">
          <thead>
            <tr>
              <th>Area</th>
              <th>What to inspect</th>
              <th>Question</th>
              <th>Source</th>
              <th>Intent</th>
            </tr>
          </thead>
          <tbody>
            {MIGRATION_ROWS.map((row) => {
              const intent = state.migrationIntents[row.id] ?? "undecided";
              return (
                <tr key={row.id}>
                  <th scope="row">{row.area}</th>
                  <td>{row.item}</td>
                  <td>{row.question}</td>
                  <td>
                    <Pill tone="held">Not inspected</Pill>
                  </td>
                  <td>
                    <select
                      aria-label={`Intent for ${row.item}`}
                      value={intent}
                      onChange={(event) =>
                        update((current) => setMigrationIntent(current, row.id, event.target.value as ImportIntent))
                      }
                    >
                      {INTENTS.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
