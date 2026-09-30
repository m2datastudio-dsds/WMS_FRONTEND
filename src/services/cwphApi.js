const BASE = "http://3.111.125.151:5000";

export async function fetchCwphTabs() {
  const r = await fetch(`${BASE}/api/cwph/tabs`);
  if (!r.ok) throw new Error(`CWPH tabs ${r.status}`);
  return r.json(); // { ok, db, at, tabs: { TAB1:{}, TAB2:{}, TAB3:{} } }
}
