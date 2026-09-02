/* ═══════════════════════════════════════════════════════════════
   Renders the GoHighLevel embeds from config.js and the
   config-driven video testimonial grid.

   Embed slots that live inside a popup (.hl-modal) load lazily,
   the first time that popup opens — the page itself stays light.
   Slots sitting directly on a page (like /booking) render at once.
   ═══════════════════════════════════════════════════════════════ */
(function () {
  var C = window.HL || {};

  function iframeFor(src, height, title) {
    var f = document.createElement("iframe");
    f.src = src;
    f.title = title;
    f.height = String(height);
    f.setAttribute("scrolling", "no");
    f.setAttribute("loading", "lazy");
    f.setAttribute("allow", "clipboard-write; camera; microphone; autoplay; encrypted-media");
    f.style.height = height + "px";
    return f;
  }

  function fallbackNote(slot, label) {
    slot.style.minHeight = "0";
    slot.innerHTML =
      '<div class="hl-embed-note">' +
      '<p class="eyebrow">' + label + "</p>" +
      "<p>This isn't connected yet. Add the URL to <code>config.js</code> " +
      "and it will appear here automatically. In the meantime, email " +
      '<a href="mailto:' + (C.email || "") + '">' + (C.email || "") + "</a>.</p>" +
      "</div>";
  }

  /* ---- GHL embeds: application form + booking calendar ---- */
  var EMBEDS = [
    { slotId: "hl-embed-slot",    url: C.applicationFormUrl, height: C.formHeight || 700,     title: "Coaching application", label: "Application" },
    { slotId: "hl-calendar-slot", url: C.calendarUrl,        height: C.calendarHeight || 780, title: "Book a call",          label: "Booking" }
  ];

  function loadEmbed(cfg) {
    var slot = document.getElementById(cfg.slotId);
    if (!slot || slot.dataset.loaded) return;
    slot.dataset.loaded = "1";
    if (cfg.url) {
      slot.appendChild(iframeFor(cfg.url, cfg.height, cfg.title));
      slot.style.minHeight = cfg.height + "px";
    } else {
      fallbackNote(slot, cfg.label);
    }
  }

  function wireEmbeds() {
    EMBEDS.forEach(function (cfg) {
      var slot = document.getElementById(cfg.slotId);
      if (!slot) return;
      if (!slot.closest(".hl-modal")) loadEmbed(cfg); /* inline slot (e.g. /booking) */
    });
    /* modal slots load the first time their popup opens */
    document.addEventListener("hl:modal-open", function (e) {
      var m = document.getElementById(e.detail && e.detail.id);
      if (!m) return;
      EMBEDS.forEach(function (cfg) {
        if (m.querySelector("#" + cfg.slotId)) loadEmbed(cfg);
      });
    });
  }

  /* ---- config-driven testimonial grid ----
     The #hl-videos section ships hidden. When config.js has clips,
     it unhides and renders them 9 at a time behind a "Load more"
     button. Players are click-to-load facades, so nothing heavy
     loads until a visitor presses play. */
  function renderTestimonials() {
    var list = C.testimonialVideos || [];
    var sec = document.getElementById("hl-videos");
    if (!sec || !list.length) return;

    var wrap = sec.querySelector(".wrap") || sec;
    sec.hidden = false;

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
    wrap.appendChild(moreWrap);

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
    wireEmbeds();
    renderBio();
    renderTestimonials();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
