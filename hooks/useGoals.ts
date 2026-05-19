"use client";

import { useEffect, useState } from "react";

export function useGoals(options?: { status?: string; includeShared?: boolean }) {
  const [goals, setGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchGoals() {
      try {
        setLoading(true);
        
        const params = new URLSearchParams();
        if (options?.status) params.append("status", options.status);
        if (options?.includeShared) params.append("includeShared", "true");

        const response = await fetch(`/api/goals?${params.toString()}`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch goals");
        }

        const data = await response.json();
        setGoals(data.goals || []);
        setError(null);
      } catch (err: any) {
        console.error("Error fetching goals:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchGoals();
  }, [options?.status, options?.includeShared]);

  return { goals, loading, error, refetch: () => setLoading(true) };
}
