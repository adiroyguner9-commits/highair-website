/* The public departures with their seat counts, from /api/departures (one
   call, cached at the CDN; 7 Nov 2026). Rows keep the Airtable shape the pages
   already read ({ id, fields }) plus `count`, the seats taken.

   One retry after a short wait: a cold function or a blip upstream should not
   leave a visitor with "dates coming soon". After that the page shows its own
   error state, never a partial list. */
export async function fetchDepartures({ retryMs = 1500 } = {}) {
  const once = async () => {
    const r = await fetch('/api/departures');
    const data = await r.json().catch(() => ({}));
    if (!r.ok || data.error || !Array.isArray(data.records)) {
      throw new Error(data.error || `departures ${r.status}`);
    }
    return data.records;
  };
  try {
    return await once();
  } catch {
    await new Promise(res => setTimeout(res, retryMs));
    return once();
  }
}
