import { useEffect, useState } from 'react';
import { fetchRwphTabs } from '../services/rwphApi';

export function useRwphTabs({ refreshMs = 10000 } = {}) {
  const [tabs, setTabs]   = useState(null);
  const [loading, setL]   = useState(true);
  const [error, setError] = useState(null);

  async function load() {
    try {
      setL(true);
      const json = await fetchRwphTabs();
      setTabs(json?.tabs ?? null);
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

  return { v, loading, error, reload: load };
}

/** Compact number formatter */
export function fmt(val, digits = 3) {
  if (val === null || val === undefined) return '--';
  const n = Number(val);
  if (Number.isNaN(n)) return String(val);
  const s = n.toFixed(digits);
  return s.indexOf('.') >= 0 ? s.replace(/\.?0+$/, '') : s;
}
