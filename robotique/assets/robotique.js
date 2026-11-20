// Club de robotique — étapes une par une, cases à cocher, visionneuse
(function () {
  function store(k, v) {
    try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; }
  }

  // 1. Étapes : une à la fois (par défaut) ou toutes
  document.querySelectorAll("[data-stepper]").forEach(function (box) {
    var items = box.querySelectorAll(".steps li");
    if (!items.length) return;
    var i = 0;
    var bar = document.createElement("div");
    bar.className = "stepbar";
    bar.innerHTML = '<button type="button" class="prev" aria-label="Étape précédente">◀</button>' +
      '<div class="prog"><i></i></div>' +
      '<button type="button" class="next">Suivant ▶</button>';
    var count = document.createElement("div");
    count.className = "stepcount";
    var toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "toggle";
    box.appendChild(bar); box.appendChild(count); box.appendChild(toggle);

    function show() {
      items.forEach(function (li, k) { li.classList.toggle("on", k === i); });
      bar.querySelector(".prev").disabled = i === 0;
      var nx = bar.querySelector(".next");
      nx.disabled = i === items.length - 1;
      nx.textContent = i === items.length - 1 ? "Terminé ✓" : "Suivant ▶";
      bar.querySelector(".prog i").style.width = ((i + 1) / items.length * 100) + "%";
      count.textContent = "Étape " + (i + 1) + " sur " + items.length;
    }
    function mode(one) {
      box.classList.toggle("stepper", one);
      bar.style.display = count.style.display = one ? "" : "none";
      toggle.textContent = one ? "Voir toutes les étapes" : "Voir une étape à la fois";
      if (one) show();
    }
    bar.querySelector(".prev").onclick = function () { if (i > 0) { i--; show(); } };
    bar.querySelector(".next").onclick = function () { if (i < items.length - 1) { i++; show(); } };
    toggle.onclick = function () { mode(!box.classList.contains("stepper")); };
    mode(true);
  });

  // 2. Cases « Je vérifie » gardées sur le téléphone
  document.querySelectorAll("[data-check]").forEach(function (list) {
    var key = "robotique-" + list.getAttribute("data-check");
    var boxes = list.querySelectorAll("input[type=checkbox]");
    var bravo = list.parentNode.querySelector(".bravo");
    var saved = (store(key) || "").split("");
    boxes.forEach(function (b, k) {
      b.checked = saved[k] === "1";
      b.addEventListener("change", update);
    });
    function update() {
      var s = "", all = true;
      boxes.forEach(function (b) { s += b.checked ? "1" : "0"; if (!b.checked) all = false; });
      store(key, s);
      if (bravo) bravo.classList.toggle("on", all);
    }
    update();
  });

  // 3. Réponses cachées (tableau comparatif)
  document.querySelectorAll("[data-reveal]").forEach(function (btn) {
    var cells = document.querySelectorAll(".reveal");
    cells.forEach(function (c) { c.classList.add("hide"); });
    btn.onclick = function () {
      var hidden = cells[0] && cells[0].classList.contains("hide");
      cells.forEach(function (c) { c.classList.toggle("hide", !hidden); });
      btn.textContent = hidden ? "Cacher les réponses" : "Voir les réponses";
    };
  });

  // 4. Visionneuse : toucher le modèle pour l'agrandir
  var lb = document.createElement("div");
  lb.className = "lightbox";
  lb.innerHTML = '<button type="button" class="btn">✕ Fermer</button><img alt="">';
  document.body.appendChild(lb);
  lb.querySelector("button").onclick = function () { lb.classList.remove("on"); };
  document.querySelectorAll(".model").forEach(function (m) {
    m.addEventListener("click", function () {
      var img = m.querySelector("img");
      lb.querySelector("img").src = img.src;
      lb.querySelector("img").alt = img.alt;
      lb.classList.add("on");
    });
  });
})();
