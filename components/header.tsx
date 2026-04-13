"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, User, LogOut, List, Menu, X } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useWatchlist } from "@/lib/watchlist-context";
import { SearchBar } from "./search-bar";

export function Header() {
  const { user, signOut } = useAuth();
  const { watchlist } = useWatchlist();
  const [showSearch, setShowSearch] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl font-bold text-primary">MAR</span>
              <span className="text-2xl font-bold text-foreground">VERSE</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/#movies" className="text-muted-foreground hover:text-foreground transition-colors">
                Movies
              </Link>
              <Link href="/#series" className="text-muted-foreground hover:text-foreground transition-colors">
                Series
              </Link>
              <Link href="/heroes" className="relative text-muted-foreground hover:text-foreground transition-colors group">
                <span className="relative z-10">Heroes</span>
                <span className="absolute inset-0 -inset-x-3 -inset-y-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 bg-foreground/[0.06] backdrop-blur-md border border-foreground/[0.08] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_4px_12px_rgba(0,0,0,0.15)]" />
              </Link>
              {user && (
                <Link href="/watchlist" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                  <List className="w-4 h-4" />
                  Watchlist
                  {watchlist.length > 0 && (
                    <span className="ml-1 bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full">
                      {watchlist.length}
                    </span>
                  )}
                </Link>
              )}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
              {/* Search Button */}
              <button
                onClick={() => setShowSearch(true)}
                className="p-2 rounded-lg hover:bg-secondary transition-all duration-200 active:scale-95"
                aria-label="Search"
              >
                <Search className="w-5 h-5 text-muted-foreground" />
              </button>

              {/* User Menu */}
              {user ? (
                <div className="hidden md:flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">{user.email}</span>
                  <button
                    onClick={signOut}
                    className="p-2 rounded-lg hover:bg-secondary transition-all duration-200 active:scale-95"
                    aria-label="Sign out"
                  >
                    <LogOut className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  <Link
                    href="/login"
                    className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Sign Up
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="md:hidden p-2 rounded-lg hover:bg-secondary transition-all duration-200"
                aria-label="Menu"
              >
                {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden bg-background border-t border-border">
            <nav className="flex flex-col p-4 gap-3">
              <Link
                href="/#movies"
                className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setShowMobileMenu(false)}
              >
                Movies
              </Link>
              <Link
                href="/#series"
                className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setShowMobileMenu(false)}
              >
                Series
              </Link>
              <Link
                href="/heroes"
                className="relative px-4 py-2 text-muted-foreground hover:text-foreground transition-colors group"
                onClick={() => setShowMobileMenu(false)}
              >
                <span className="relative z-10">Heroes</span>
                <span className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 bg-foreground/[0.06] backdrop-blur-md border border-foreground/[0.08] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_4px_12px_rgba(0,0,0,0.15)]" />
              </Link>
              {user ? (
                <>
                  <Link
                    href="/watchlist"
                    className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    <List className="w-4 h-4" />
                    Watchlist ({watchlist.length})
                  </Link>
                  <button
                    onClick={() => {
                      signOut();
                      setShowMobileMenu(false);
                    }}
                    className="px-4 py-2 text-left text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-center"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* Search Modal */}
      <SearchBar isOpen={showSearch} onClose={() => setShowSearch(false)} />
    </>
  );
}
