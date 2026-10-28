import { hrefFor } from "../app/routes";
import { useWorkspace } from "../app/store";
import { PageHeader, Pill } from "../ui/bits";

export function FactoryFloor({ onOperate }: { onOperate: () => void }) {
  const { state } = useWorkspace();
  const specialists = state.agents.filter((agent) => agent.department === "Specialists").length;
  const routes = state.planning.filter((note) => note.source === "desk").length;

  const rooms = [
    { title: "Command Centre", detail: "Idle. Core health unavailable.", href: "#/command", wide: true },
    ...state.scouts.map((scout) => ({
      title: scout.title,
      detail: scout.authorisedScope.trim() ? "Scope note stored. Not observing." : "Not observing. Scope empty.",
      href: "#/desk",
      wide: false,
    })),
    { title: "Desk Analyst", detail: `${state.deskNotes.length} operator notes`, href: "#/desk", wide: false },
    { title: "Desk Prioritiser", detail: "Dedup is local to operator notes.", href: "#/desk", wide: false },
    { title: "Desk Router", detail: routes ? `${routes} local route proposals` : "No route proposals", href: "#/jobs", wide: false },
    { title: "Master hall", detail: `${state.agents.filter((agent) => agent.department === "Masters").length} coordinating drafts. No private schedulers.`, href: "#/workforce", wide: true },
    { title: "Specialist rooms", detail: specialists ? `${specialists} specialist drafts` : "No specialist roster", href: "#/workforce", wide: false },
    { title: "Agent Factory", detail: "Definitions only", href: "#/factory", wide: false },
    { title: "Training Academy", detail: "Fixtures can be listed. None have run.", href: "#/factory", wide: false },
    { title: "Visual Studio", detail: "Proof workflow recorded locally", href: hrefFor("visual", "visual.taco-ng"), wide: false },
    { title: "Execution bay", detail: "No canonical job is in progress.", href: "#/jobs", wide: false },
    { title: "Handoff table", detail: routes ? `${routes} planning notes from the desk` : "No handoff is executing.", href: "#/jobs", wide: false },
  ];

  return (
    <section className="page floor-page">
      <PageHeader
        kicker="Factory mode"
        title="The floor shows the same records as Operator mode."
        lede="Stations stay quiet because no canonical job is running. Counts below are drafts and operator notes, not completed work."
      />
      <div className="floor">
        {rooms.map((room) => (
          <a key={room.title} className={room.wide ? "room wide" : "room"} href={room.href} onClick={onOperate}>
            <span className="kicker">Station</span>
            <strong>{room.title}</strong>
            <span>{room.detail}</span>
            <Pill tone="held">Idle</Pill>
          </a>
        ))}
      </div>
    </section>
  );
}
