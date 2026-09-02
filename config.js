/* ═══════════════════════════════════════════════════════════════
   HYBRID LIFE COACHING — SITE CONFIG
   ───────────────────────────────────────────────────────────────
   This is the only file you need to touch to go live.
   Fill a value in, commit, push. Vercel redeploys in ~30 seconds.
   Anything left as "" simply stays switched off.
   ═══════════════════════════════════════════════════════════════ */

window.HL = {

  /* ── APPLICATION FORM + CALENDAR ───────────────────────────
     applicationFormUrl
       Any embeddable form URL. Currently the Typeform
       application; a GHL form embed src also works.

     calendarUrl
       GHL → Calendars → your calendar → Share → Embed
       → copy the iframe `src`. Renders at /booking.
     ───────────────────────────────────────────────────────── */
  applicationFormUrl: "https://form.typeform.com/to/hy1Nv6Og",
  calendarUrl: "https://api.leadconnectorhq.com/widget/booking/3hM9N4v7azJwnwqmbTci",

  /* Height in px for each embed. Bump if the form scrolls internally. */
  formHeight: 700,
  calendarHeight: 780,


  /* ── VIDEO ─────────────────────────────────────────────────
     Provider for the testimonial videos:
     "wistia" | "vimeo" | "youtube"
     ───────────────────────────────────────────────────────── */
  videoProvider: "wistia",

  /* ── VIDEO TESTIMONIALS ────────────────────────────────────
     One entry per clip — the section renders itself as a grid,
     nine at a time behind a "Load more" button, and videos only
     load when clicked, so any number of clips stays fast.

       { id: "abc123", name: "Anthony",
         role: "Business owner · 16 weeks",
         caption: "Down 41 lbs while travelling.",
         provider: "youtube" }   // provider optional,
                                 // defaults to videoProvider

     While this list is empty the whole section stays hidden.
     ───────────────────────────────────────────────────────── */
  testimonialVideos: [],


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
