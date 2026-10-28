import { useEffect, useState } from "react";
import { parseHash, type Route } from "./app/routes";
import { WorkspaceProvider } from "./app/store";
import { Shell } from "./ui/Shell";

export function App() {
  const [route, setRoute] = useState<Route>(() => parseHash(window.location.hash));

  useEffect(() => {
    const sync = () => setRoute(parseHash(window.location.hash));
    window.addEventListener("hashchange", sync);
    if (!window.location.hash) window.location.hash = "#/command";
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  return (
    <WorkspaceProvider>
      <Shell route={route} />
    </WorkspaceProvider>
  );
}
