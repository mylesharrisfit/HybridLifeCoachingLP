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
  /* Four cards, four across on desktop, 2x2 on phones.
     Each entry needs a thumbnail in /assets and the post URL.
     Links open in a new tab so the page stays behind them.

       { poster:  "/assets/clip-01.jpg",
         href:    "https://www.instagram.com/reel/XXXXXXXXX/",
         source:  "Watch on Instagram",     // optional label
         name:    "Marcel",
         role:    "Business owner \u00b7 16 weeks",
         caption: "Down 18 lbs and every lift went up." }

     While this list is empty the whole section stays hidden. */
  testimonialVideos: [
    { poster: "/assets/clip-01.jpg",
      href: "https://www.instagram.com/reel/Dax44RfRFMA/",
      name: "Edgar",
      role: "Chef, business owner, dad",
      caption: "Scaled to $25k months and lost 25 lbs at the same time." },

    { poster: "/assets/clip-02.jpg",
      href: "https://www.instagram.com/reel/DY5FPVsPrrJ/",
      name: "Zay",
      role: "9-5, 6 months",
      caption: "70 lbs down without cancelling a holiday or a night out." },

    { poster: "/assets/clip-03.jpg",
      href: "https://www.instagram.com/reel/DYX5fCbtJEx/",
      name: "Mateo",
      role: "Overnight shifts, dad",
      caption: "35 lbs down with a young family and nights on the clock." },

    { poster: "/assets/clip-04.jpg",
      href: "https://www.instagram.com/reel/DYDedqXAOf6/",
      name: "Quincey",
      role: "Active military, 5 months",
      caption: "50 lbs down without giving up a single weekend." },
  ],


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
  coachingSince: "2020",
  clientsCoached: "100+",
  certifications: "",       // left empty on purpose — the row hides itself
  portraitImage: "/assets/myles-portrait.jpg",


  /* ── CONTACT ───────────────────────────────────────────── */
  email: "mylesharrisfitbusiness@gmail.com",
  instagram: "https://www.instagram.com/hybridlifeco",
};
