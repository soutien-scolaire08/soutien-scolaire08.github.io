(function (SSA) {
  "use strict";

  var legal = SSA.config.legal || {};
  var contact = SSA.config.contact || {};

  var values = {
    nom: legal.nom,
    statut: legal.statut,
    adresse: legal.adresse,
    telephone: legal.telephone || contact.phone,
    hebergeur: legal.hebergeur,
    conservation: legal.conservation
  };

  Array.prototype.forEach.call(document.querySelectorAll("[data-legal]"), function (el) {
    var value = values[el.getAttribute("data-legal")];
    if (value) {
      el.textContent = value;
      return;
    }
    var optional = el.closest("[data-legal-optional]");
    if (optional) {
      optional.hidden = true;
    } else {
      el.textContent = "[À compléter dans js/config.js]";
      el.classList.add("todo");
    }
  });

})(window.SSA);
