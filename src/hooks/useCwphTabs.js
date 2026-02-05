import { useEffect, useState } from "react";
import { fetchCwphTabs } from "../services/cwphApi";

export function useCwphTabs({ refreshMs = 10000 } = {}) {
  const [tabs, setTabs]   = useState(null);
  const [at, setAt]       = useState(null);   //  store backend timestamp
  const [loading, setL]   = useState(true);
  const [error, setError] = useState(null);

  async function load() {
    try {
      setL(true);
      const json = await fetchCwphTabs();
      setTabs(json?.tabs ?? null);
      setAt(json?.at ?? null);                
      setError(null);
    } catch (e) {
      setError(e);
    } finally {
      setL(false);
    }
  }

  useEffect(() => {
    load();
    if (!refreshMs) return;
    const t = setInterval(load, refreshMs);
    return () => clearInterval(t);
  }, [refreshMs]);

  const v = (tab, key) => (tabs?.[tab]?.[key] ?? null);
  return { v, loading, error, at, reload: load };
}

export function fmt(val, digits = 3) {
  if (val === null || val === undefined) return "--";
  const n = Number(val);
  if (Number.isNaN(n)) return String(val);
  const s = n.toFixed(digits);
  return s.includes(".") ? s.replace(/\.?0+$/, "") : s;
}
