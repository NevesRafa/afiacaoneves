import { getStore } from "@netlify/blobs";

export default async (req) => {
  const url = new URL(req.url);
  const slug = url.searchParams.get("slug") || "";
  const src = url.searchParams.get("src") || "direct";
  if (!slug) {
    return new Response("missing slug", { status: 400 });
  }
  const store = getStore("clicks");
  const day = new Date().toISOString().slice(0, 10);
  const key = `${day}|${src}|${slug}`;
  const cur = (await store.get(key, { type: "json" })) || { slug, src, count: 0 };
  cur.count += 1;
  cur.last = new Date().toISOString();
  await store.setJSON(key, cur);
  return new Response(null, { status: 204 });
};

export const config = { path: "/api/hit" };
