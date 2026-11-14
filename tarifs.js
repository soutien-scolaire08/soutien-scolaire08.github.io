(function (SSA) {
  "use strict";

  var table = document.getElementById("priceTable");
  var prices = SSA.config.prices;
  var levels = (prices.levels || []).filter(function (level) { return typeof level.hour === "number"; });
  var tiers = prices.weeklyDiscount || [{ lessons: 1, off: 0, label: "Tarif horaire" }];
  if (!table || !levels.length) { return; }

  function make(tag, text) {
    var el = document.createElement(tag);
    if (text) { el.textContent = text; }
    return el;
  }

  function tierFor(perWeek) {
    var found = tiers[0];
    tiers.forEach(function (tier) { if (perWeek >= tier.lessons) { found = tier; } });
    return found;
  }

  var head = table.createTHead().insertRow();
  head.appendChild(make("th", "Niveau")).scope = "col";
  tiers.forEach(function (tier) { head.appendChild(make("th", tier.label)).scope = "col"; });

  var body = table.createTBody();
  levels.forEach(function (level) {
    var row = body.insertRow();
    row.appendChild(make("th", level.label)).scope = "row";
    tiers.forEach(function (tier) {
      row.appendChild(make("td", SSA.euro(level.hour - tier.off) + " / h"));
    });
  });

  var levelSelect = document.getElementById("calcLevel");
  var perWeekSelect = document.getElementById("calcPerWeek");
  var durationSelect = document.getElementById("calcDuration");
  var result = document.getElementById("calcResult");
  if (!levelSelect || !perWeekSelect || !durationSelect || !result) { return; }

  levels.forEach(function (level, index) {
    var option = make("option", level.label);
    option.value = String(index);
    levelSelect.appendChild(option);
  });

  function update() {
    var level = levels[Number(levelSelect.value)];
    var perWeek = Number(perWeekSelect.value);
    var duration = Number(durationSelect.value);
    var hourly = level.hour - tierFor(perWeek).off;
    var weekly = hourly * perWeek * duration;
    result.textContent = "";
    [["Tarif horaire", SSA.euro(hourly)], ["Par semaine", SSA.euro(weekly)], ["Par mois (4 semaines)", SSA.euro(weekly * 4)]].forEach(function (pair) {
      var box = make("div");
      box.className = "calc-box";
      box.appendChild(make("small", pair[0]));
      box.appendChild(make("strong", pair[1]));
      result.appendChild(box);
    });
  }

  [levelSelect, perWeekSelect, durationSelect].forEach(function (select) { select.addEventListener("change", update); });
  update();
})(window.SSA);
