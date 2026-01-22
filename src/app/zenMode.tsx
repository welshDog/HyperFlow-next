"use client";

import { createContext, useContext, useState } from "react";

interface ZenModeContextValue {
  zen: boolean;
  setZen: (v: boolean) => void;
}

const ZenModeContext = createContext<ZenModeContextValue | undefined>(undefined);

export function ZenModeProvider({ children }: { children: React.ReactNode }) {
  const [zen, setZen] = useState(false);
  return (
    <ZenModeContext.Provider value={{ zen, setZen }}>{children}</ZenModeContext.Provider>
  );
}

export function useZenMode() {
  const ctx = useContext(ZenModeContext);
  if (!ctx) throw new Error("ZenModeProvider missing");
  return ctx;
}

