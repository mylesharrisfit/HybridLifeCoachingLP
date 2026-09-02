/* ═══════════════════════════════════════════════════════════════
   Renders the GoHighLevel embeds from config.js, wires the VSL,
   and hides any video testimonial slot that has no ID yet.
   ═══════════════════════════════════════════════════════════════ */
(function () {
  var C = window.HL || {};

  function el(tag, attrs) {
    var n = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) { n.setAttribute(k, attrs[k]); });
    return n;
  }

  function iframeFor(src, height, title) {
    var f = el("iframe", {
      src: src,
      title: title,
      height: String(height),
      scrolling: "no",
      loading: "lazy",
      allow: "clipboard-write; camera; microphone; autoplay; encrypted-media",
    });
    f.style.height = height + "px";
    return f;
  }

  /* ---- application-gate state ----
     The Step 2 calendar on the home page stays locked until the
     Typeform is submitted. Submission is remembered per visitor so
     returning applicants keep access. /booking is never gated. */
  function hasApplied() {
    try { return localStorage.getItem("hl_applied") === "1"; } catch (e) { return false; }
  }
  function markApplied() {
    try { localStorage.setItem("hl_applied", "1"); } catch (e) {}
    unlockCalendar(true);
  }
  function calendarIframe() {
    return iframeFor(C.calendarUrl, C.calendarHeight || 780, "Book a call");
  }
  function unlockCalendar(scroll) {
    var book = document.getElementById("hl-book");
    var slot = book && book.querySelector("#hl-calendar-slot");
    if (!slot || !C.calendarUrl || slot.querySelector("iframe")) return;
    slot.innerHTML = "";
    slot.appendChild(calendarIframe());
    slot.style.minHeight = (C.calendarHeight || 780) + "px";
    if (scroll && book.scrollIntoView) book.scrollIntoView({ behavior: "smooth" });
  }

  /* ---- application form (home page) ---- */
  function renderForm() {
    var slot = document.getElementById("hl-embed-slot");
    if (!slot) return;

    if (!C.applicationFormUrl) {
      slot.style.minHeight = "0";
      slot.innerHTML =
        '<div class="hl-embed-note">' +
        '<p class="eyebrow">Application</p>' +
        "<p>The application form isn't connected yet. Add your form " +
        "URL to <code>config.js</code> and it will appear here " +
        "automatically. In the meantime, email " +
        '<a href="mailto:' + (C.email || "") + '" style="color:var(--red-lt)">' +
        (C.email || "") + "</a>.</p>" +
        "</div>";
      return;
    }

    var height = C.formHeight || 700;
    slot.style.minHeight = height + "px";

    function plainIframe() {
      if (slot.querySelector("iframe")) return;
      slot.appendChild(iframeFor(C.applicationFormUrl, height, "Coaching application"));
    }

    /* Typeform: prefer the official embed so we get a reliable
       submit event to unlock Step 2 with. Anything else (or the
       embed script failing to load) falls back to a plain iframe
       plus a postMessage listener. */
    var tfMatch = C.applicationFormUrl.match(/typeform\.com\/to\/([A-Za-z0-9_-]+)/);
    if (tfMatch) {
      slot.style.height = height + "px";
      var s = document.createElement("script");
      s.src = "https://embed.typeform.com/next/embed.js";
      s.onload = function () {
        if (window.tf && window.tf.createWidget) {
          window.tf.createWidget(tfMatch[1], {
            container: slot,
            width: "100%",
            height: height,
            onSubmit: markApplied,
          });
        } else {
          plainIframe();
        }
      };
      s.onerror = plainIframe;
      document.head.appendChild(s);
    } else {
      plainIframe();
    }

    /* Fallback submit signal from an iframe'd Typeform. */
    window.addEventListener("message", function (ev) {
      var t = ev && ev.data && ev.data.type;
      var okOrigin = typeof ev.origin === "string" &&
        (ev.origin.indexOf("typeform.com") !== -1 || ev.origin === window.location.origin);
      if (okOrigin && (t === "form-submit" || t === "form_submit")) markApplied();
    });
  }

  /* ---- GHL calendar (/booking page + gated home-page Step 2) ---- */
  function renderCalendar() {
    var slot = document.getElementById("hl-calendar-slot");
    if (!slot) return;

    if (!C.calendarUrl) {
      slot.style.minHeight = "0";
      slot.innerHTML =
        '<div class="hl-embed-note">' +
        '<p class="eyebrow">Booking</p>' +
        "<p>The calendar isn't connected yet. Add your GoHighLevel calendar " +
        "URL to <code>config.js</code> and it will appear here " +
        "automatically. In the meantime, email " +
        '<a href="mailto:' + (C.email || "") + '" style="color:var(--red-lt)">' +
        (C.email || "") + "</a>.</p>" +
        "</div>";
      return;
    }

    /* Home page: locked until the application is submitted. */
    if (slot.closest("#hl-book") && !hasApplied()) {
      slot.style.minHeight = "0";
      slot.innerHTML =
        '<div class="hl-embed-note">' +
        '<p class="eyebrow">Locked</p>' +
        "<p>The calendar opens the moment your application is submitted " +
        "in Step 1 above. Apply first &mdash; then pick your time right here.</p>" +
        "</div>";
      return;
    }

    slot.appendChild(calendarIframe());
    slot.style.minHeight = (C.calendarHeight || 780) + "px";
  }

  /* ---- config-driven testimonial grid ----
     Renders C.testimonialVideos as a 3-across grid, nine cards at a
     time behind a "Load more" button. Players are click-to-load
     facades, so nothing heavy loads until a visitor presses play. */
  function renderTestimonials() {
    var sec = document.getElementById("hl-stories");
    if (!sec) return;

    var list = C.testimonialVideos || [];
    if (!list.length) { sec.hidden = true; return; }

    var wrap = sec.querySelector(".wrap") || sec;

    var SRC = {
      wistia: function (id) { return "https://fast.wistia.net/embed/iframe/" + id + "?autoPlay=true"; },
      vimeo: function (id) { return "https://player.vimeo.com/video/" + id + "?autoplay=1&title=0&byline=0&portrait=0"; },
      youtube: function (id) { return "https://www.youtube-nocookie.com/embed/" + id + "?autoplay=1&rel=0&modestbranding=1"; }
    };

    var grid = document.createElement("div");
    grid.className = "vgrid";
    wrap.appendChild(grid);

    function makeCard(t) {
      var prov = t.provider || C.videoProvider || "wistia";
      if (!SRC[prov] || !t.id) return null;

      var card = document.createElement("div");
      card.className = "vcard";

      var btn = document.createElement("button");
      btn.className = "player";
      btn.type = "button";
      btn.setAttribute("aria-label", "Play testimonial" + (t.name ? " from " + t.name : ""));
      /* free poster frame for YouTube clips; others keep the facade */
      var poster = t.poster || (prov === "youtube" ? "https://i.ytimg.com/vi/" + t.id + "/hqdefault.jpg" : "");
      if (poster) btn.style.setProperty("--poster", "url('" + poster + "')");
      btn.innerHTML =
        '<span class="player-fallback" aria-hidden="true"></span>' +
        '<span class="player-veil" aria-hidden="true"></span>' +
        '<span class="play" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></span>';
      btn.addEventListener("click", function () {
        if (btn.querySelector("iframe")) return;
        var f = document.createElement("iframe");
        f.src = SRC[prov](t.id);
        f.setAttribute("allow", "autoplay; fullscreen; picture-in-picture");
        f.setAttribute("allowfullscreen", "");
        f.title = t.name ? "Testimonial from " + t.name : "Video testimonial";
        btn.innerHTML = "";
        btn.appendChild(f);
        btn.style.cursor = "default";
        if (window.dataLayer) { window.dataLayer.push({ event: "vsl_play", video_id: t.id }); }
        if (window.fbq) { fbq("trackCustom", "VSLPlay", { video_id: t.id }); }
      });
      card.appendChild(btn);

      if (t.name || t.role || t.caption) {
        var cap = document.createElement("div");
        cap.className = "cap";
        if (t.name) { var b = document.createElement("b"); b.textContent = t.name; cap.appendChild(b); }
        if (t.role) { var r = document.createElement("div"); r.className = "role"; r.textContent = t.role; cap.appendChild(r); }
        if (t.caption) { var p = document.createElement("p"); p.textContent = t.caption; cap.appendChild(p); }
        card.appendChild(cap);
      }
      return card;
    }

    var BATCH = 9;
    var shown = 0;

    var moreWrap = document.createElement("div");
    moreWrap.style.textAlign = "center";
    moreWrap.style.marginTop = "34px";
    var moreBtn = document.createElement("button");
    moreBtn.className = "btn btn-ghost";
    moreBtn.type = "button";
    moreWrap.appendChild(moreBtn);
    grid.parentNode.insertBefore(moreWrap, grid.nextSibling);

    function showMore() {
      var next = list.slice(shown, shown + BATCH);
      next.forEach(function (t) {
        var card = makeCard(t);
        if (card) grid.appendChild(card);
      });
      shown += next.length;
      if (shown >= list.length) {
        moreWrap.hidden = true;
      } else {
        moreBtn.textContent = "Load more (" + (list.length - shown) + " remaining)";
      }
    }
    moreBtn.addEventListener("click", showMore);
    showMore();
  }

  /* ---- coach credentials + portrait ---- */
  function renderBio() {
    document.querySelectorAll("[data-cred]").forEach(function (row) {
      var v = C[row.getAttribute("data-cred")];
      if (v) {
        row.querySelector("dd").textContent = v;
      } else {
        row.hidden = true;
        row.style.display = "none";
      }
    });

    var portrait = document.getElementById("hl-portrait");
    if (portrait && C.portraitImage) {
      portrait.style.backgroundImage = "url('" + C.portraitImage + "')";
      portrait.style.backgroundSize = "cover";
      portrait.style.backgroundPosition = "center";
      portrait.innerHTML = "";
    }
  }

  function init() {
    renderForm();
    renderCalendar();
    renderBio();
    renderTestimonials();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
