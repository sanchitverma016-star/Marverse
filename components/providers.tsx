"use client";

import { AuthProvider } from "@/lib/auth-context";
import { WatchlistProvider } from "@/lib/watchlist-context";
import { PageTransition } from "@/components/page-transition";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <WatchlistProvider>
        <PageTransition>
          {children}
        </PageTransition>
      </WatchlistProvider>
    </AuthProvider>
  );
}
