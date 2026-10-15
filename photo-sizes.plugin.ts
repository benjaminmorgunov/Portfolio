// Vite plugin: exposes `virtual:photo-sizes` — { "/src/assets/...jpg": width/height }.
// Reads image headers at build time, so adding/removing files needs no code edits.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import type { Plugin } from "vite";

function size(buf: Buffer): [number, number] | null {
  if (buf[0] === 0x89 && buf[1] === 0x50) return [buf.readUInt32BE(16), buf.readUInt32BE(20)];
  if (buf[0] !== 0xff || buf[1] !== 0xd8) return null;
  let i = 2;
  while (i < buf.length) {
    if (buf[i] !== 0xff) { i++; continue; }
    const m = buf[i + 1];
    const len = buf.readUInt16BE(i + 2);
    if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc)
      return [buf.readUInt16BE(i + 7), buf.readUInt16BE(i + 5)];
    i += 2 + len;
  }
  return null;
}

function walk(dir: string, out: string[] = []) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(jpe?g|png)$/i.test(f)) out.push(p);
  }
  return out;
}

export function photoSizes(): Plugin {
  const id = "virtual:photo-sizes";
  const root = process.cwd();
  const assets = join(root, "src/assets");
  return {
    name: "photo-sizes",
    resolveId: (s) => (s === id ? "\0" + id : null),
    load(s) {
      if (s !== "\0" + id) return null;
      const map: Record<string, number> = {};
      for (const f of walk(assets)) {
        this.addWatchFile(f);
        const d = size(readFileSync(f));
        if (d) map["/" + relative(root, f).split("\\").join("/")] = d[0] / d[1];
      }
      return `export default ${JSON.stringify(map)};`;
    },
    configureServer(server) {
      server.watcher.add(assets);
      const reload = (f: string) => {
        if (!f.startsWith(assets)) return;
        const m = server.moduleGraph.getModuleById("\0" + id);
        if (m) server.moduleGraph.invalidateModule(m);
      };
      server.watcher.on("add", reload);
      server.watcher.on("unlink", reload);
    },
  };
}
