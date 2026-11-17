#!/usr/bin/env node
// Blog Studio: make the STUDIO_USERS entry for one person.
//   node scripts/studio-user.mjs Judith "her personal code"
// Prints the hash line for STUDIO_USERS (the code itself is never stored). Combine the lines of all users into one
// JSON object, e.g. {"Leonard":"…","Judith":"…","Emily":"…"}, and paste it as the STUDIO_USERS env var in Vercel.
import { createHash, randomBytes } from "node:crypto";

const [name, code] = process.argv.slice(2);
if (!name || !code) {
  console.error('usage: node scripts/studio-user.mjs <name> <code>\n\nno code yet? a random one: ' + randomBytes(9).toString("base64url"));
  process.exit(1);
}
if (code.length < 8) console.error("warning: use a code of at least 8 characters");
const hash = createHash("sha256").update(code.trim()).digest("hex");
console.log(`"${name}":"${hash}"`);
