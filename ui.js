(function () {
  "use strict";

  document.documentElement.classList.add("js");

  document.addEventListener("DOMContentLoaded", function () {
    var menuButton = document.getElementById("menuButton");
    var menu = document.getElementById("menu");
    if (menuButton && menu) {
      menuButton.addEventListener("click", function () {
        var open = menu.classList.toggle("open");
        menuButton.setAttribute("aria-expanded", String(open));
      });
      menu.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () {
          menu.classList.remove("open");
          menuButton.setAttribute("aria-expanded", "false");
        });
      });
    }

    var backToTop = document.createElement("button");
    backToTop.type = "button";
    backToTop.className = "back-to-top";
    backToTop.setAttribute("aria-label", "Remonter en haut de la page");
    backToTop.textContent = "↑";
    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    document.body.appendChild(backToTop);

    function updateBackToTop() {
      if (window.scrollY > 420) {
        backToTop.classList.add("visible");
      } else {
        backToTop.classList.remove("visible");
      }
    }

    updateBackToTop();
    window.addEventListener("scroll", updateBackToTop, { passive: true });

    var hasObserver = "IntersectionObserver" in window;
    var blocks = document.querySelectorAll(".reveal");
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!hasObserver || reduceMotion) {
      blocks.forEach(function (el) { el.classList.add("is-visible"); });
    } else {
      var revealer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -5% 0px" });
      blocks.forEach(function (el) { revealer.observe(el); });
    }

    var sticky = document.getElementById("stickyCta");
    if (sticky && hasObserver) {
      var visible = 0;
      var hider = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) { visible += entry.isIntersecting ? 1 : -1; });
        sticky.classList.toggle("is-hidden", visible > 0);
      });
      ["reservation"].forEach(function (id) { var el = document.getElementById(id); if (el) { hider.observe(el); } });
      var footer = document.querySelector(".site-footer");
      if (footer) { hider.observe(footer); }
    }
  });
})();
