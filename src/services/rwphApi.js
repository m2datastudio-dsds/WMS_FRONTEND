const BASE = 'http://localhost:5000';

export async function fetchRwphTabs() {
  const r = await fetch(`${BASE}/api/rwph/tabs`);
  if (!r.ok) throw new Error(`RWPH tabs ${r.status}`);
  return r.json(); // { ok, tabs: { TAB1:{A..}, TAB2:{A..}, TAB3:{A..} } }
}
