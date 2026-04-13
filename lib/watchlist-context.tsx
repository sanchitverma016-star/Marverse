"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { useAuth } from "./auth-context";

export interface WatchlistItem {
  tmdbId: number;
  type: "movie" | "series";
  title: string;
  posterPath: string | null;
  addedAt: string;
}

interface WatchlistContextType {
  watchlist: WatchlistItem[];
  addToWatchlist: (item: Omit<WatchlistItem, "addedAt">) => void;
  removeFromWatchlist: (tmdbId: number) => void;
  isInWatchlist: (tmdbId: number) => boolean;
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

export function WatchlistProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);

  useEffect(() => {
    if (user) {
      const stored = localStorage.getItem(`marverse_watchlist_${user.id}`);
      if (stored) {
        try {
          setWatchlist(JSON.parse(stored));
        } catch {
          setWatchlist([]);
        }
      }
    } else {
      setWatchlist([]);
    }
  }, [user]);

  const saveWatchlist = (items: WatchlistItem[]) => {
    if (user) {
      localStorage.setItem(`marverse_watchlist_${user.id}`, JSON.stringify(items));
    }
  };

  const addToWatchlist = (item: Omit<WatchlistItem, "addedAt">) => {
    if (!user) return;
    
    const newItem: WatchlistItem = {
      ...item,
      addedAt: new Date().toISOString(),
    };
    
    setWatchlist(prev => {
      const exists = prev.some(i => i.tmdbId === item.tmdbId);
      if (exists) return prev;
      const updated = [...prev, newItem];
      saveWatchlist(updated);
      return updated;
    });
  };

  const removeFromWatchlist = (tmdbId: number) => {
    setWatchlist(prev => {
      const updated = prev.filter(item => item.tmdbId !== tmdbId);
      saveWatchlist(updated);
      return updated;
    });
  };

  const isInWatchlist = (tmdbId: number) => {
    return watchlist.some(item => item.tmdbId === tmdbId);
  };

  return (
    <WatchlistContext.Provider value={{ watchlist, addToWatchlist, removeFromWatchlist, isInWatchlist }}>
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlist() {
  const context = useContext(WatchlistContext);
  if (context === undefined) {
    throw new Error("useWatchlist must be used within a WatchlistProvider");
  }
  return context;
}
