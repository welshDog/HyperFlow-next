"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { ZenModeProvider } from "./zenMode";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <ZenModeProvider>{children}</ZenModeProvider>
    </QueryClientProvider>
  );
}
