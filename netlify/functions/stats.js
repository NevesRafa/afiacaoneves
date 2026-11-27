import { getStore } from "@netlify/blobs";

export default async () => {
  const store = getStore("clicks");
  const rows = [];
  let cursor;
  do {
    const page = await store.list({ cursor });
    for (const blob of page.blobs) {
      const value = await store.get(blob.key, { type: "json" });
      if (value) {
        rows.push({ key: blob.key, ...value });
      }
    }
    cursor = page.cursor;
  } while (cursor);

  rows.sort((a, b) => (b.last || "").localeCompare(a.last || ""));
  return Response.json({ total: rows.reduce((s, r) => s + (r.count || 0), 0), rows });
};

export const config = { path: "/api/stats" };
