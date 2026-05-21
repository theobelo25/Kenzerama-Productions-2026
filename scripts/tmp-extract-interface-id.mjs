import { readFileSync } from "node:fs";

const file = "directus/extensions/jpp-permalink-generator/dist/index.js";
const source = readFileSync(file, "utf8");
const idMatch = source.match(/id:"([^"]+)"/);
console.log("id:", idMatch?.[1] ?? "not found");
const idx = source.indexOf("defineInterface");
console.log(source.slice(idx, idx + 800));
