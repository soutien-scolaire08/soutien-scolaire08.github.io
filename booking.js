(function (SSA) {
  "use strict";

  var form = document.getElementById("bookingForm");
  if (!form) { return; }

  var cfg = SSA.config;
  var errorBox = document.getElementById("formError");
  var confirmBox = document.getElementById("confirm");
  var DAY_NAMES = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];

  SSA.go = function (url) { window.location.href = url; };

  function value(name) { return form.elements[name].value.trim(); }
  function digits(text) { return String(text || "").replace(/\D/g, ""); }

  function parseISO(iso) {
    var p = iso.split("-");
    return new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]));
  }

  function prettyDate(iso) {
    return parseISO(iso).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  }

  function checkedValues(name) {
    return Array.prototype.map.call(form.querySelectorAll('input[name="' + name + '"]:checked'), function (el) { return el.value; });
  }

  function dateError(iso, label) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) { return "Choisis une date pour " + label + "."; }
    var date = parseISO(iso);
    if (date < SSA.minDate()) { return "La date de " + label + " doit être à partir de demain."; }
    if (cfg.booking.closedDays.indexOf(date.getDay()) !== -1) {
      return "Nous n'avons pas de cours le " + DAY_NAMES[date.getDay()] + ". Choisis un autre jour pour " + label + ".";
    }
    return "";
  }

  function validPhone(text) {
    var d = digits(text);
    return /^0\d{9}$/.test(d) || /^33\d{9}$/.test(d);
  }

  function validate() {
    if (!value("parent")) { return "Indique ton nom."; }
    if (!validPhone(value("phone"))) { return "Indique un numéro de téléphone valide (10 chiffres)."; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value("email"))) { return "Indique une adresse e-mail valide."; }
    if (!value("child")) { return "Indique le prénom de l'enfant."; }
    if (!value("level")) { return "Choisis le niveau de l'enfant."; }
    if (checkedValues("subject").length === 0) { return "Choisis au moins une matière."; }
    if (!value("commune")) { return "Choisis ta commune."; }
    var error = dateError(value("date1"), "la date souhaitée");
    if (error) { return error; }
    if (!value("slot1")) { return "Choisis un créneau horaire."; }
    if (value("date2") || value("slot2")) {
      error = dateError(value("date2"), "ton 2e choix");
      if (error) { return error; }
      if (!value("slot2")) { return "Choisis un créneau pour ton 2e choix."; }
    }
    if (!document.getElementById("consent").checked) { return "Coche la case pour accepter d'être recontacté."; }
    return "";
  }

  function buildMessage() {
    var lines = [
      "Bonjour, je souhaite réserver le premier cours gratuit.",
      "",
      "Parent : " + value("parent"),
      "Téléphone : " + value("phone"),
      "E-mail : " + value("email"),
      "Enfant : " + value("child") + " (" + value("level") + ")",
      "Matière(s) : " + checkedValues("subject").join(", "),
      "Commune : " + value("commune"),
      "Lieu : " + checkedValues("mode")[0],
      "Créneau souhaité : " + prettyDate(value("date1")) + ", " + value("slot1")
    ];
    if (value("date2")) { lines.push("2e choix : " + prettyDate(value("date2")) + ", " + value("slot2")); }
    if (value("message")) { lines.push("Message : " + value("message")); }
    return lines.join("\n");
  }

  function realEmail() {
    var email = cfg.contact.email;
    return email && !/exemple/.test(email) ? email : "";
  }

  function pickChannel() {
    if (cfg.booking.formEndpoint) { return "endpoint"; }
    if (digits(cfg.contact.whatsapp)) { return "whatsapp"; }
    if (realEmail()) { return "email"; }
    return "";
  }

  function makeEl(tag, className, text) {
    var el = document.createElement(tag);
    if (className) { el.className = className; }
    if (text) { el.textContent = text; }
    return el;
  }

  function showConfirmation(sent, message, link, linkLabel) {
    confirmBox.textContent = "";
    confirmBox.appendChild(makeEl("div", "confirm-icon", sent ? "✅" : "📨"));
    confirmBox.appendChild(makeEl("h3", "", sent ? "Demande envoyée !" : "Votre demande est prête"));
    confirmBox.appendChild(makeEl("p", "", sent
      ? "Merci ! Nous vous recontactons très vite pour confirmer le créneau du premier cours gratuit."
      : "Si votre messagerie ne s'est pas ouverte, utilisez le bouton ci-dessous pour envoyer votre demande."));

    var actions = makeEl("div", "confirm-actions");
    if (link) {
      var send = makeEl("a", "btn btn-primary", linkLabel);
      send.href = link;
      send.target = "_blank";
      send.rel = "noopener";
      actions.appendChild(send);
    }
    var back = makeEl("button", "btn btn-light", "Modifier ma demande");
    back.type = "button";
    back.addEventListener("click", function () {
      confirmBox.hidden = true;
      form.hidden = false;
    });
    actions.appendChild(back);
    confirmBox.appendChild(actions);
    confirmBox.appendChild(makeEl("pre", "", message));

    form.hidden = true;
    confirmBox.hidden = false;
    confirmBox.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    errorBox.textContent = "";

    var problem = validate();
    if (problem) { errorBox.textContent = problem; return; }

    var channel = pickChannel();
    if (!channel) { errorBox.textContent = "La réservation n'est pas encore configurée (voir config.js)."; return; }

    var message = buildMessage();
    var subject = "Premier cours gratuit – " + value("child");

    if (channel === "endpoint") {
      var payload = {
        parent: value("parent"), telephone: value("phone"), email: value("email"),
        enfant: value("child"), niveau: value("level"), matieres: checkedValues("subject").join(", "),
        commune: value("commune"), lieu: checkedValues("mode")[0],
        creneau: prettyDate(value("date1")) + ", " + value("slot1"),
        creneau2: value("date2") ? prettyDate(value("date2")) + ", " + value("slot2") : "",
        message: value("message"), resume: message,
        _subject: subject, _captcha: "false", _template: "table"
      };
      var button = form.querySelector('button[type="submit"]');
      button.disabled = true;
      fetch(cfg.booking.formEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(payload)
      }).then(function (response) {
        return response.json().catch(function () { return {}; }).then(function (data) {
          var refused = data.success === false || data.success === "false";
          if (!response.ok || refused) { throw new Error("envoi refusé"); }
          showConfirmation(true, message);
        });
      }).catch(function () {
        errorBox.textContent = "L'envoi a échoué. Réessaie, ou contacte-nous directement par téléphone ou par e-mail.";
      }).then(function () { button.disabled = false; });
      return;
    }

    if (channel === "whatsapp") {
      var wa = "https://wa.me/" + digits(cfg.contact.whatsapp) + "?text=" + encodeURIComponent(message);
      showConfirmation(false, message, wa, "Envoyer sur WhatsApp");
      SSA.go(wa);
      return;
    }

    var mail = "mailto:" + realEmail() + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(message);
    showConfirmation(false, message, mail, "Envoyer par e-mail");
    SSA.go(mail);
  });

  document.getElementById("date1").addEventListener("change", function () {
    if (this.value) { document.getElementById("date2").min = this.value; }
  });
})(window.SSA);
