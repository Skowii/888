import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { loadWorkspace } from "./logic";
import { createSeedState } from "./seed";
import type { WorkspaceState } from "./types";

const KEY = "taco-ng.workspace.v1";

interface Api {
  state: WorkspaceState;
  warning: string | null;
  storageError: string | null;
  update: (mutator: (state: WorkspaceState) => WorkspaceState) => void;
  replace: (state: WorkspaceState) => void;
  reset: () => void;
}

const WorkspaceContext = createContext<Api | null>(null);

function readStorage(): string | null {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const initial = useMemo(() => loadWorkspace(readStorage()), []);
  const [state, setState] = useState(initial.state);
  const [warning, setWarning] = useState(initial.warning);
  const [storageError, setStorageError] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
      setStorageError(null);
    } catch {
      setStorageError("Browser storage rejected the draft. Export a copy from Settings.");
    }
  }, [state]);

  const api = useMemo<Api>(
    () => ({
      state,
      warning,
      storageError,
      update: (mutator) => setState((current) => mutator(current)),
      replace: (next) => {
        setWarning(null);
        setState(next);
      },
      reset: () => {
        setWarning(null);
        setState(createSeedState());
      },
    }),
    [state, warning, storageError],
  );

  return <WorkspaceContext.Provider value={api}>{children}</WorkspaceContext.Provider>;
}

export function useWorkspace(): Api {
  const value = useContext(WorkspaceContext);
  if (!value) throw new Error("Workspace missing");
  return value;
}
