import { useEffect, useState } from "react";
import { NAV } from "../app/catalog";
import type { Route } from "../app/routes";
import { useWorkspace } from "../app/store";
import { Capabilities } from "../views/Capabilities";
import { Chat } from "../views/Chat";
import { CommandCentre } from "../views/CommandCentre";
import { FactoryAcademy } from "../views/FactoryAcademy";
import { FactoryFloor } from "../views/FactoryFloor";
import { Jobs } from "../views/Jobs";
import { MigrationMap } from "../views/MigrationMap";
import { Projects } from "../views/Projects";
import { SettingsView } from "../views/SettingsView";
import { VisualStudio } from "../views/VisualStudio";
import { WatchingDesk } from "../views/WatchingDesk";
import { Workforce } from "../views/Workforce";

export function Shell({ route }: { route: Route }) {
  const { state, warning, storageError } = useWorkspace();
  const [mode, setMode] = useState<"operator" | "factory">(() =>
    sessionStorage.getItem("taco-ng.mode") === "factory" ? "factory" : "operator",
  );
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.density = state.settings.density;
  }, [state.settings.density]);

  useEffect(() => {
    sessionStorage.setItem("taco-ng.mode", mode);
  }, [mode]);

  useEffect(() => {
    setNavOpen(false);
  }, [route.name, route.id, mode]);

  return (
    <div className={navOpen ? "shell nav-open" : "shell"}>
      <a className="skip" href="#workspace">
        Skip to workspace
      </a>
      <aside className="nav" aria-label="TACO modules">
        <a className="brand" href="#/command">
          <span className="brand-mark">Z3R0TH</span>
          <strong>TACO Next</strong>
          <span className="brand-sub">Isolated candidate</span>
        </a>
        {NAV.map((group) => (
          <div key={group.group} className="nav-group">
            <p>{group.group}</p>
            {group.items.map((item) => (
              <a key={item.id} href={item.href} aria-current={route.name === item.id ? "page" : undefined}>
                {item.label}
              </a>
            ))}
          </div>
        ))}
      </aside>
      <div className="main">
        <header className="topbar">
          <button type="button" className="btn nav-toggle" aria-expanded={navOpen} onClick={() => setNavOpen((open) => !open)}>
            Menu
          </button>
          <p className="top-status" data-testid="core-banner">
            Canonical Core is not mounted
          </p>
          <div className="mode-switch" role="group" aria-label="Viewing mode">
            <button type="button" aria-pressed={mode === "operator"} onClick={() => setMode("operator")}>
              Operator
            </button>
            <button type="button" aria-pressed={mode === "factory"} onClick={() => setMode("factory")}>
              Factory
            </button>
          </div>
        </header>
        <div id="workspace" className="content">
          {warning ? <p className="banner">{warning}</p> : null}
          {storageError ? <p className="banner">{storageError}</p> : null}
          {mode === "factory" ? (
            <FactoryFloor onOperate={() => setMode("operator")} />
          ) : (
            <WorkspaceRoute route={route} />
          )}
        </div>
      </div>
    </div>
  );
}

function WorkspaceRoute({ route }: { route: Route }) {
  switch (route.name) {
    case "desk":
      return <WatchingDesk />;
    case "jobs":
      return <Jobs />;
    case "chat":
      return <Chat chatId={route.id} />;
    case "workforce":
      return <Workforce agentId={route.id} />;
    case "factory":
      return <FactoryAcademy />;
    case "projects":
      return <Projects projectId={route.id} />;
    case "visual":
      return <VisualStudio jobId={route.id} />;
    case "capabilities":
      return <Capabilities />;
    case "migration":
      return <MigrationMap />;
    case "settings":
      return <SettingsView />;
    default:
      return <CommandCentre />;
  }
}
