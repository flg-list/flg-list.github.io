"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { AppState, Project } from "./types";

const KEY = "flg-state-v1";

const EMPTY: AppState = { founderName: "", projects: [] };

interface Store {
  state: AppState;
  hydrated: boolean;
  setFounderName: (name: string) => void;
  addProject: (p: Project) => void;
  updateProject: (id: string, fn: (p: Project) => Project) => void;
  removeProject: (id: string) => void;
}

const Ctx = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(EMPTY);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setState(JSON.parse(raw));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(KEY, JSON.stringify(state));
  }, [state, hydrated]);

  const setFounderName = useCallback(
    (founderName: string) => setState((s) => ({ ...s, founderName })),
    []
  );
  const addProject = useCallback(
    (p: Project) => setState((s) => ({ ...s, projects: [...s.projects, p] })),
    []
  );
  const updateProject = useCallback(
    (id: string, fn: (p: Project) => Project) =>
      setState((s) => ({
        ...s,
        projects: s.projects.map((p) => (p.id === id ? fn(p) : p)),
      })),
    []
  );
  const removeProject = useCallback(
    (id: string) =>
      setState((s) => ({ ...s, projects: s.projects.filter((p) => p.id !== id) })),
    []
  );

  return (
    <Ctx.Provider value={{ state, hydrated, setFounderName, addProject, updateProject, removeProject }}>
      {children}
    </Ctx.Provider>
  );
}

export function useStore(): Store {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useStore outside StoreProvider");
  return ctx;
}
