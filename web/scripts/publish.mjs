// Copies the static export (web/out) to the repository root, which is what
// Cloudflare Pages serves. Run through `npm run release`.
//
// Only what the build produces is replaced. Everything else at the root
// (assets/, admin.html, css/, js/, data/, worker/, ...) is left alone. The
// list of published entries is kept in .published.json, so the next release
// first removes the previous one's files and nothing stale is left behind.
import { copyFile, cp, readdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const here = path.dirname(fileURLToPath(import.meta.url));
const out = path.resolve(here, "../out");
const root = path.resolve(here, "../..");
const manifest = path.join(root, ".published.json");

// Never removed or overwritten, whatever a manifest says.
const PROTECTED = new Set(["assets", "admin.html", "css", "js", "data", "docs", "tools", "worker", "web", "build", ".git", ".claude", "wrangler.toml", ".gitignore"]);

await stat(path.join(out, "index.html")).catch(() => {
  throw new Error("web/out/index.html is missing. Run `next build` first.");
});

// The export writes route prefetch data as nested folders
// (projects/__next.projects/__PAGE__.txt), but the browser asks for the
// flattened name (projects/__next.projects.__PAGE__.txt). Add the flattened
// copy beside each one so client-side navigation finds its data on a static host.
async function flattenPrefetch(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (!entry.isDirectory()) continue;
    if (entry.name.startsWith("__next.")) {
      const files = await readdir(full, { recursive: true, withFileTypes: true });
      for (const f of files.filter(f => f.isFile())) {
        const inner = path.relative(full, path.join(f.parentPath, f.name)).split(path.sep).join(".");
        await copyFile(path.join(f.parentPath, f.name), path.join(dir, `${entry.name}.${inner}`));
      }
    } else if (entry.name !== "_next") {
      await flattenPrefetch(full);
    }
  }
}
await flattenPrefetch(out);

const previous = JSON.parse(await readFile(manifest, "utf8").catch(() => "[]"));
for (const name of previous) {
  if (!PROTECTED.has(name)) await rm(path.join(root, name), { recursive: true, force: true });
}

const entries = (await readdir(out)).filter(name => !PROTECTED.has(name));
for (const name of entries) {
  await cp(path.join(out, name), path.join(root, name), { recursive: true, force: true });
}
await writeFile(manifest, JSON.stringify(entries.sort(), null, 2) + "\n");
console.log(`published ${entries.length} entries to ${root}`);
