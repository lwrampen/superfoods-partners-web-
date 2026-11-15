import { createHash } from "node:crypto";
import { SIGNATURES } from "./data";

// /signatures — the team's email signatures on one page, behind a 4-digit team code (Leonard, Nov 2026).
// The code is checked on the server; a correct code sets an httpOnly cookie for 30 days. This is a light
// gate for an internal page (phone numbers), not real security. The signature images themselves stay public
// under /signature/ because Gmail must be able to load them.

const PIN = process.env.SIGNATURE_PIN || "4242";
const COOKIE = "sfp_sig";
const token = () => createHash("sha256").update(`sfp-signatures:${PIN}`).digest("hex").slice(0, 32);

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

const HEAD = (title: string) => `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow"><title>${title}</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Anton&family=Archivo:wght@400;600&family=IBM+Plex+Mono:wght@500&display=swap" rel="stylesheet">
<style>
:root{--forest:#1C4B0C;--ink:#19220F;--muted:#5B6650;--cream:#FBFFF6;--sand:#EFF1E8;--line:#DCE6CC;--lime:#8CC541}
*{box-sizing:border-box}body{margin:0;background:var(--sand);color:var(--ink);font-family:Archivo,Helvetica,Arial,sans-serif}
.wrap{max-width:1180px;margin:0 auto;padding:40px 20px 80px}
.eyebrow{font-family:'IBM Plex Mono',Menlo,monospace;font-size:11px;letter-spacing:.22em;text-transform:uppercase;color:var(--muted)}
h1{font-family:Anton,Impact,sans-serif;font-weight:400;font-size:clamp(34px,5vw,52px);line-height:.95;color:var(--forest);margin:10px 0 0;text-transform:uppercase}
.btn{font-family:'IBM Plex Mono',Menlo,monospace;font-size:12px;letter-spacing:.14em;text-transform:uppercase;border:0;border-radius:8px;padding:13px 18px;cursor:pointer;background:var(--forest);color:var(--cream)}
.btn:hover{background:var(--ink)}.btn.done{background:var(--lime);color:var(--ink)}
</style></head><body>`;

function gate(error: boolean) {
  return `${HEAD("Team signatures")}
<div class="wrap" style="min-height:100vh;display:grid;place-items:center">
  <form method="post" style="background:#fff;border-radius:16px;padding:36px 32px;width:min(380px,100%);text-align:center;box-shadow:0 30px 60px -40px rgba(25,34,15,.4)">
    <div class="eyebrow">Superfoods Partners · Pure Matcha Partners</div>
    <h1 style="font-size:36px">Team signatures</h1>
    <p style="color:var(--muted);font-size:15px;margin:14px 0 22px">Enter the 4-digit team code.</p>
    <input name="pin" type="password" inputmode="numeric" pattern="[0-9]*" maxlength="4" autocomplete="off" autofocus aria-label="Team code"
      style="width:180px;font:500 28px 'IBM Plex Mono',monospace;letter-spacing:.5em;text-align:center;padding:12px 0 12px .5em;border:1px solid var(--line);border-radius:10px;background:var(--cream);outline-color:var(--forest)"
      oninput="if(this.value.length===4)this.form.submit()">
    ${error ? `<p style="color:#B24A18;font-size:14px;margin:14px 0 0">That code is not right. Try again.</p>` : ""}
    <div style="margin-top:22px"><button class="btn" type="submit">Open</button></div>
  </form>
</div></body></html>`;
}

const STEPS = {
  en: [
    "Find your name below and click <b>Copy signature</b>.",
    "Open <b>Gmail on a computer</b> (not the phone app) → the gear icon at the top right → <b>See all settings</b>.",
    "On the <b>General</b> tab, scroll to <b>Signature</b> → <b>Create new</b> → give it a name (for example “Team”) → click in the box and paste (<b>Cmd+V</b> on Mac, <b>Ctrl+V</b> on Windows).",
    "Under <b>Signature defaults</b>, choose the new signature for <b>For new emails use</b> and for <b>On reply/forward use</b>.",
    "Scroll all the way down and click <b>Save Changes</b>. Then send yourself a test email.",
  ],
  nl: [
    "Zoek hieronder je naam en klik op <b>Copy signature</b>.",
    "Open <b>Gmail op je computer</b> (niet de telefoon-app) → het tandwiel rechtsboven → <b>Alle instellingen bekijken</b>.",
    "Op het tabblad <b>Algemeen</b>: scroll naar <b>Handtekening</b> → <b>Nieuwe maken</b> → geef hem een naam (bijv. “Team”) → klik in het vak en plak (<b>Cmd+V</b> op Mac, <b>Ctrl+V</b> op Windows).",
    "Kies onder <b>Standaardinstellingen voor handtekening</b> de nieuwe handtekening bij <b>Voor nieuwe e-mails</b> én bij <b>Bij beantwoorden/doorsturen</b>.",
    "Scroll helemaal naar beneden en klik op <b>Wijzigingen opslaan</b>. Stuur jezelf daarna een testmail.",
  ],
};
const TIPS = {
  en: "Tips: don’t resize or edit the images in Gmail. The Gmail phone app can’t show this signature; mail you send from the app uses the app’s own “Mobile signature” (Settings → your account), so keep that one short or off.",
  nl: "Tips: pas de afbeeldingen in Gmail niet aan. De Gmail-app op je telefoon kan deze handtekening niet tonen; mail vanuit de app gebruikt de eigen “Mobiele handtekening” (Instellingen → je account), houd die kort of zet hem uit.",
};
const list = (k: "en" | "nl") => `<ol style="margin:14px 0 0;padding-left:22px;font-size:15.5px;line-height:1.7">${STEPS[k].map((s) => `<li>${s}</li>`).join("")}</ol><p style="margin:14px 0 0;font-size:14px;color:var(--muted);line-height:1.6">${TIPS[k]}</p>`;

function page() {
  const cards = SIGNATURES.map(
    (s) => `<section class="card" data-q="${esc(`${s.name} ${s.email}`.toLowerCase())}" style="background:#fff;border-radius:16px;padding:22px 22px 24px;display:flex;flex-direction:column;gap:16px">
  <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap">
    <div><div style="font-weight:600;font-size:17px">${esc(s.name)}</div><div style="font-size:13.5px;color:var(--muted)">${esc(s.email)}</div></div>
    <button class="btn copy" type="button" data-id="${s.id}">Copy signature</button>
  </div>
  <div style="overflow-x:auto"><div id="sig-${s.id}">${s.html}</div></div>
</section>`,
  ).join("\n");
  return `${HEAD("Team signatures · SFP & PMP")}
<div class="wrap">
  <div class="eyebrow">Superfoods Partners · Pure Matcha Partners</div>
  <h1>Your new email signature</h1>
  <div style="background:#fff;border-radius:16px;padding:24px 24px 22px;margin-top:26px;border-left:4px solid var(--lime)">
    <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap">
      <div style="font-weight:600;font-size:18px">Set it up in Gmail — 2 minutes</div>
      <div role="tablist" style="display:flex;gap:4px;background:var(--sand);border-radius:8px;padding:3px">
        <button type="button" class="lang" data-l="en" style="border:0;border-radius:6px;padding:6px 12px;font:500 12px 'IBM Plex Mono',monospace;cursor:pointer">EN</button>
        <button type="button" class="lang" data-l="nl" style="border:0;border-radius:6px;padding:6px 12px;font:500 12px 'IBM Plex Mono',monospace;cursor:pointer">NL</button>
      </div>
    </div>
    <div data-steps="en">${list("en")}</div><div data-steps="nl" hidden>${list("nl")}</div>
  </div>
  <input id="q" type="search" placeholder="Search your name…" aria-label="Search" style="margin:26px 0 16px;width:min(360px,100%);font:15px Archivo,sans-serif;padding:12px 14px;border:1px solid var(--line);border-radius:10px;background:#fff">
  <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,520px),1fr));gap:16px">${cards}</div>
</div>
<script>
const setLang=(l)=>{document.querySelectorAll('[data-steps]').forEach(e=>e.hidden=e.dataset.steps!==l);document.querySelectorAll('.lang').forEach(b=>{b.style.background=b.dataset.l===l?'#fff':'transparent'});try{localStorage.setItem('sig-lang',l)}catch(e){}};
let l0='en';try{const v=localStorage.getItem('sig-lang');l0=v||((navigator.language||'').toLowerCase().startsWith('nl')?'nl':'en')}catch(e){}
setLang(l0);document.querySelectorAll('.lang').forEach(b=>b.onclick=()=>setLang(b.dataset.l));
document.getElementById('q').oninput=(e)=>{const v=e.target.value.toLowerCase().trim();document.querySelectorAll('.card').forEach(c=>c.style.display=!v||c.dataset.q.includes(v)?'':'none')};
document.querySelectorAll('.copy').forEach(btn=>btn.onclick=async()=>{
  const node=document.getElementById('sig-'+btn.dataset.id);let ok=false;
  try{await navigator.clipboard.write([new ClipboardItem({'text/html':new Blob([node.innerHTML],{type:'text/html'}),'text/plain':new Blob([node.innerText],{type:'text/plain'})})]);ok=true}catch(e){}
  if(!ok){const r=document.createRange();r.selectNodeContents(node);const s=getSelection();s.removeAllRanges();s.addRange(r);ok=document.execCommand('copy');s.removeAllRanges()}
  btn.textContent=ok?'Copied ✓':'Select & copy';btn.classList.toggle('done',ok);setTimeout(()=>{btn.textContent='Copy signature';btn.classList.remove('done')},2200);
});
</script></body></html>`;
}

const HTML_HEADERS = { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" };

export async function GET(req: Request) {
  const ok = (req.headers.get("cookie") ?? "").split(/;\s*/).includes(`${COOKIE}=${token()}`);
  return new Response(ok ? page() : gate(false), { headers: HTML_HEADERS });
}

export async function POST(req: Request) {
  const form = await req.formData().catch(() => null);
  const pin = String(form?.get("pin") ?? "").trim();
  if (pin !== PIN) {
    await new Promise((r) => setTimeout(r, 800)); // slow down guessing
    return new Response(gate(true), { status: 401, headers: HTML_HEADERS });
  }
  return new Response(null, {
    status: 303,
    headers: { Location: "/signatures", "Set-Cookie": `${COOKIE}=${token()}; Path=/signatures; Max-Age=2592000; HttpOnly; Secure; SameSite=Lax`, "Cache-Control": "no-store" },
  });
}
