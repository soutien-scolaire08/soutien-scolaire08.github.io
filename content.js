(function (SSA) {
  "use strict";

  var cfg = SSA.config;

  SSA.euro = function (n) {
    return n.toLocaleString("fr-FR", { minimumFractionDigits: n % 1 === 0 ? 0 : 2, maximumFractionDigits: 2 }) + " €";
  };

  function isPlaceholder(value) { return !value || /exemple|TON_COMPTE/.test(value); }
  function digits(value) { return String(value || "").replace(/\D/g, ""); }
  function each(selector, fn) { Array.prototype.forEach.call(document.querySelectorAll(selector), fn); }

  var links = {
    email: !isPlaceholder(cfg.contact.email) ? "mailto:" + cfg.contact.email : "",
    phone: digits(cfg.contact.phone) ? "tel:+" + (digits(cfg.contact.phone).replace(/^0/, "33")) : "",
    whatsapp: digits(cfg.contact.whatsapp) ? "https://wa.me/" + digits(cfg.contact.whatsapp) : ""
  };

  each("[data-contact]", function (el) {
    var kind = el.getAttribute("data-contact");
    if (!links[kind]) {
      if (kind !== "email") { el.hidden = true; }
      return;
    }
    el.href = links[kind];
    el.hidden = false;
    if (kind === "email" && el.hasAttribute("data-show-text")) {
      el.textContent = (el.textContent.indexOf("✉️") === 0 ? "✉️ " : "") + cfg.contact.email;
    }
  });

  var minutes = cfg.booking.freeLessonMinutes;
  var freeText = minutes % 60 === 0 ? (minutes / 60) + " h" : minutes + " min";
  each("[data-free-minutes]", function (el) { el.textContent = freeText; });

  var levels = (cfg.prices.levels || []).filter(function (level) { return typeof level.hour === "number"; });
  var discounts = (cfg.prices.weeklyDiscount || []).filter(function (tier) { return tier.off > 0; });
  each("[data-price-card]", function (card) { card.hidden = levels.length === 0; });
  if (levels.length) {
    var lowest = Math.min.apply(null, levels.map(function (level) { return level.hour; }));
    each('[data-price="hour"]', function (el) { el.textContent = SSA.euro(lowest); });
    var biggest = discounts.reduce(function (max, tier) { return Math.max(max, tier.off); }, 0);
    each('[data-price="maxoff"]', function (el) { el.textContent = SSA.euro(biggest); });
    each("[data-discount-text]", function (el) {
      el.textContent = discounts.map(function (tier) {
        return "−" + SSA.euro(tier.off) + " par heure dès " + tier.lessons + " cours par semaine";
      }).join(" · ");
    });
    if (!discounts.length) { each('[data-price-card="discount"]', function (card) { card.hidden = true; }); }
  }

  ["slot1", "slot2"].forEach(function (id, index) {
    var select = document.getElementById(id);
    if (!select) { return; }
    var first = document.createElement("option");
    first.value = "";
    first.textContent = index === 0 ? "Choisir…" : "—";
    select.appendChild(first);
    cfg.booking.slots.forEach(function (slot) {
      var option = document.createElement("option");
      option.textContent = slot;
      select.appendChild(option);
    });
  });

  SSA.minDate = function () {
    var d = new Date();
    d.setDate(d.getDate() + cfg.booking.minDaysAhead);
    d.setHours(0, 0, 0, 0);
    return d;
  };
  SSA.toISO = function (d) {
    var m = String(d.getMonth() + 1).padStart(2, "0");
    var day = String(d.getDate()).padStart(2, "0");
    return d.getFullYear() + "-" + m + "-" + day;
  };
  ["date1", "date2"].forEach(function (id) {
    var input = document.getElementById(id);
    if (input) { input.min = SSA.toISO(SSA.minDate()); }
  });

  var media = cfg.media;
  var section = document.getElementById("medias");
  var grid = document.getElementById("mediaGrid");
  var gallery = document.getElementById("mediaGallery");

  if (section && grid && gallery) {
    if (media.video) {
      var box = document.createElement("div");
      box.className = "media-video";
      var video = document.createElement("video");
      video.controls = true;
      video.playsInline = true;
      video.preload = "metadata";
      video.src = media.video;
      if (media.poster) { video.poster = media.poster; }
      box.appendChild(video);
      grid.appendChild(box);
    }

    media.photos.forEach(function (photo) {
      var img = document.createElement("img");
      img.src = photo.src;
      img.alt = photo.alt || "";
      img.loading = "lazy";
      if (photo.position) { img.style.objectPosition = photo.position; }
      gallery.appendChild(img);
    });

    if (grid.children.length === 1) { grid.style.gridTemplateColumns = "1fr"; }
    section.hidden = !(grid.children.length || gallery.children.length);
  }
})(window.SSA);
