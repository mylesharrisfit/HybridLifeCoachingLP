/* ═══════════════════════════════════════════════════════════════
   HYBRID LIFE COACHING — SITE CONFIG
   ───────────────────────────────────────────────────────────────
   This is the only file you need to touch to go live.
   Fill a value in, commit, push. Vercel redeploys in ~30 seconds.
   Anything left as "" simply stays switched off.
   ═══════════════════════════════════════════════════════════════ */

window.HL = {

  /* ── GO HIGH LEVEL ─────────────────────────────────────────
     applicationFormUrl
       GHL → Sites → Forms → your application form → Integrate
       → Embed → copy the iframe `src`.
       Looks like:
       https://api.leadconnectorhq.com/widget/form/XXXXXXXXXXXX

     calendarUrl
       GHL → Calendars → your calendar → Share → Embed
       → copy the iframe `src`.
       Looks like:
       https://api.leadconnectorhq.com/widget/booking/XXXXXXXXXXXX
     ───────────────────────────────────────────────────────── */
  applicationFormUrl: "",
  calendarUrl: "",

  /* Height in px for each embed. Bump if GHL scrolls internally. */
  formHeight: 900,
  calendarHeight: 780,


  /* ── VIDEO ─────────────────────────────────────────────────
     Provider for all videos: "wistia" | "vimeo" | "youtube"
     VSL id: for wistia.com/medias/abc123xyz the id is abc123xyz
     ───────────────────────────────────────────────────────── */
  videoProvider: "wistia",
  vslId: "",


  /* ── TRACKING ──────────────────────────────────────────────
     Leave empty until you have real IDs — empty means the
     scripts never load at all, which keeps the page fast and
     keeps you out of consent trouble.
     ───────────────────────────────────────────────────────── */
  metaPixelId: "",   // e.g. "1234567890123456"
  ga4Id: "",         // e.g. "G-XXXXXXXXXX"


  /* ── COACH BIO BLOCK ───────────────────────────────────────
     Leave a value empty and that row is hidden rather than
     showing a blank. portraitImage: drop a 4:5 photo into
     /assets and put the path here.
     ───────────────────────────────────────────────────────── */
  coachingSince: "",        // e.g. "2019"
  clientsCoached: "",       // e.g. "100+"
  certifications: "",       // e.g. "NASM-CPT, Precision Nutrition L1"
  portraitImage: "",        // e.g. "/assets/myles-portrait.jpg"


  /* ── CONTACT ───────────────────────────────────────────── */
  email: "mylesharrisfitbusiness@gmail.com",
  instagram: "https://www.instagram.com/hybridlifeco",
};
