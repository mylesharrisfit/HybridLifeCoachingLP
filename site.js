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
      allow: "clipboard-write",
    });
    f.style.height = height + "px";
    return f;
  }

  /* ---- GHL application form (home page) ---- */
  function renderForm() {
    var slot = document.getElementById("hl-embed-slot");
    if (!slot) return;

    if (C.applicationFormUrl) {
      slot.appendChild(
        iframeFor(C.applicationFormUrl, C.formHeight || 900, "Coaching application")
      );
      slot.style.minHeight = (C.formHeight || 900) + "px";
      return;
    }

    /* No form URL configured yet — show something honest instead
       of an empty box. */
    slot.style.minHeight = "0";
    slot.innerHTML =
      '<div class="hl-embed-note">' +
      '<p class="eyebrow">Application</p>' +
      "<p>The application form isn't connected yet. Add your GoHighLevel " +
      "form URL to <code>config.js</code> and it will appear here " +
      "automatically. In the meantime, email " +
      '<a href="mailto:' + (C.email || "") + '" style="color:var(--red-lt)">' +
      (C.email || "") + "</a>.</p>" +
      "</div>";
  }

  /* ---- GHL calendar (/booking page) ---- */
  function renderCalendar() {
    var slot = document.getElementById("hl-calendar-slot");
    if (!slot) return;

    if (C.calendarUrl) {
      slot.appendChild(
        iframeFor(C.calendarUrl, C.calendarHeight || 780, "Book a call")
      );
      slot.style.minHeight = (C.calendarHeight || 780) + "px";
      return;
    }

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
  }

  /* ---- testimonial video slots ---- */
  function wireVideo() {
    var root = document.getElementById("hl");
    if (!root) return;

    root.querySelectorAll(".player").forEach(function (p) {
      if (C.videoProvider && p.dataset.id && p.dataset.id.indexOf("VIDEO_ID") !== 0) {
        p.dataset.provider = p.dataset.provider || C.videoProvider;
      }
    });

    /* Hide testimonial cards still holding a placeholder id, so the
       page never shows a row of dead thumbnails. */
    root.querySelectorAll(".vcard").forEach(function (card) {
      var p = card.querySelector(".player");
      if (p && p.dataset.id && p.dataset.id.indexOf("VIDEO_ID_") === 0) {
        card.hidden = true;
      }
    });

    /* If every testimonial slot is empty, hide the whole section. */
    var cards = root.querySelectorAll(".vcard");
    if (cards.length) {
      var anyVisible = Array.prototype.some.call(cards, function (c) { return !c.hidden; });
      if (!anyVisible) {
        var sec = cards[0].closest("section");
        if (sec) sec.hidden = true;
      }
    }
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
    wireVideo();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
