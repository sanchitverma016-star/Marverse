"use client";

import React from "react"

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

interface PageTransitionProps {
  children: React.ReactNode;
}

// Store to manage transition direction
let transitionDirection: "forward" | "back" = "forward";

export function setTransitionDirection(direction: "forward" | "back") {
  transitionDirection = direction;
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [displayChildren, setDisplayChildren] = useState(children);

  useEffect(() => {
    // When pathname changes, trigger fade out then fade in
    setDirection(transitionDirection);
    setIsVisible(false);
    
    const timeout = setTimeout(() => {
      setDisplayChildren(children);
      setIsVisible(true);
      // Reset direction for next navigation
      transitionDirection = "forward";
    }, 300);

    return () => clearTimeout(timeout);
  }, [pathname, children]);

  return (
    <div
      className={`transition-all duration-300 ease-out ${
        isVisible
          ? "opacity-100 translate-x-0"
          : direction === "forward"
            ? "opacity-0 translate-x-8"
            : "opacity-0 -translate-x-8"
      }`}
    >
      {displayChildren}
    </div>
  );
}
