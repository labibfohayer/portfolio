"use client";

import { useEffect } from "react";

export default function PageTracker() {
  useEffect(() => {
    // Only track once per session
    if (!sessionStorage.getItem("has_visited")) {
      fetch("/api/track", { method: "POST" })
        .then(() => sessionStorage.setItem("has_visited", "true"))
        .catch(console.error);
    }
  }, []);

  return null;
}
