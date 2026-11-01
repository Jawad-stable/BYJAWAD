// Refreshes the CMS snapshot that pages are pre-rendered with. Runs before
// every build; if the content API can't be reached, the last snapshot stays.
import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const API = "https://portfolio-content-api.khmaystjwad.workers.dev/api/content";
const out = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../src/data/content.json");

try {
  const res = await fetch(API, { signal: AbortSignal.timeout(15000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  if (!Array.isArray(data.items)) throw new Error("no items in response");
  await writeFile(out, JSON.stringify(data, null, 2) + "\n");
  console.log(`snapshot: ${data.items.length} items`);
} catch (error) {
  console.warn(`snapshot: kept the previous file (${error.message})`);
}
