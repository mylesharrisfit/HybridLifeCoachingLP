# hybridlifecoaching.net

Landing page for Hybrid Life Coaching.

**Stack:** static site → GitHub → Vercel (host) → Cloudflare (DNS) → GoHighLevel (form + calendar).

No build step. No dependencies. Push to `main`, Vercel redeploys in about 30 seconds.

---

## The only file you need to edit

**`config.js`** — GoHighLevel URLs, video IDs, tracking IDs, bio credentials.

Anything left as `""` is switched off cleanly: the page hides the row, or shows a
sensible fallback, rather than rendering an empty box or a dead script.

```js
window.HL = {
  applicationFormUrl: "",   // GHL form embed src
  calendarUrl: "",          // GHL calendar embed src (/booking page)
  metaPixelId: "",          // Meta pixel
  ga4Id: "",                // GA4
  ...
};
```

---

## Connecting GoHighLevel

### Application form

GHL → **Sites → Forms** → open your application form → **Integrate → Embed** →
copy the `src` out of the iframe. It looks like:

```
https://api.leadconnectorhq.com/widget/form/abc123XYZ
```

Paste it into `applicationFormUrl`. It renders in the `#hl-form` block at the
bottom of the home page. Because it's a native GHL form, submissions land in your
CRM and fire your workflows — nothing is hand-coded, nothing to keep in sync.

Pipeline stages already agreed: **New Lead → Booked Call → No Show → Call Completed → Closed Won/Lost.**

### Calendar

GHL → **Calendars** → your calendar → **Share → Embed** → copy the `src`:

```
https://api.leadconnectorhq.com/widget/booking/abc123XYZ
```

Paste it into `calendarUrl`. It renders at **/booking**, reachable via the
`/call` and `/book` shortcuts. The landing page itself no longer links to it —
all page CTAs go to the application form.

Suggested flow: cold traffic → application form → GHL workflow sends the calendar
link on qualification. Warm traffic (DMs, referrals) → straight to `/booking`.

---

## Pages

| Path | File | Notes |
|---|---|---|
| `/` | `index.html` | The landing page — 15 sections |
| `/booking` | `booking.html` | Calendar embed, `noindex` |
| `/privacy` | `privacy.html` | Required for Meta ads |
| `/terms` | `terms.html` | |
| `/apply` | → `/#hl-form` | redirect |
| `/call`, `/book` | → `/booking` | redirect |

Clean URLs are handled in `vercel.json` — no `.html` in any link.

---

## Still to fill in

- [x] `applicationFormUrl` — the Typeform application is connected
- [x] `calendarUrl` — the GHL booking calendar is connected
- [ ] `/assets/hero.jpg` — the hero image (16:9). Until it exists the hero
      shows a dark gradient in its place
- [ ] Video testimonials — add entries to `testimonialVideos` in `config.js`
      (id, name, role, caption, optional provider). Any number of clips: the
      section renders as a grid, nine at a time behind a Load-more button, and
      each video only loads when clicked. **The whole section auto-hides while
      the list is empty**, so nothing broken shows.
- [ ] `coachingSince`, `clientsCoached`, `certifications` in `config.js` —
      each row hides itself until filled
- [ ] `portraitImage` — 4:5 portrait into `/assets`, path into `config.js`
- [ ] `/assets/og-image.jpg` — 1200×630, dark shot with the logo. This is what
      renders when the link is tapped from your IG bio
- [ ] `metaPixelId` and `ga4Id`
- [ ] `[ STATE ]` and `[ COUNTY / STATE ]` in `terms.html` — governing law
- [ ] Lawyer review of `privacy.html` and `terms.html` before production
- [ ] Written consent from every named client and every face in a transformation photo

---

## Tracking events

Already wired in the page script, firing only when the IDs exist:

| Event | When |
|---|---|
| `PageView` | load |
| `Lead` | any solid CTA click |
| `VSLPlay` | testimonial video start |
| scroll depth | 25 / 50 / 75 / 90% |

Scroll depth is the useful one — it tells you which section people quit at.

---

## Local preview

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

Clean URLs won't work locally (that's a Vercel behaviour) — use
`/booking.html` etc. when testing on your machine.
