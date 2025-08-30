const svgContainer = document.getElementById("svgContainer");
const tooltip = document.getElementById("tooltip");
const details = document.getElementById("details");
const speciesSelect = document.getElementById("speciesSelect");
const systemTabs = document.querySelectorAll(".system-tab");
const searchInput = document.getElementById("searchParts");
const langButtons = document.querySelectorAll(".lang-switch button");

let currentLang = "en";
let labels = {};
let partsData = {};

function loadLabels(lang) {
  fetch(`../labels/${lang}.json`)
    .then(res => res.json())
    .then(data => {
      labels = data;
      updateLabels();
    });
}

function loadData() {
  const species = document.body.dataset.species;
  const system = document.body.dataset.system;
  fetch(`../data/${species}/${system}.json`)
    .then(res => res.json())
    .then(data => {
      partsData = data;
    });
}

function loadSVG() {
  const species = document.body.dataset.species;
  const system = document.body.dataset.system;
  fetch(`../svg/${species}/${system}.svg`)
    .then(res => res.text())
    .then(svg => {
      svgContainer.innerHTML = svg;
      attachSVGListeners();
    });
}

function attachSVGListeners() {
  const regions = svgContainer.querySelectorAll("[data-id]");
  regions.forEach(region => {
    region.addEventListener("click", () => showDetails(region.dataset.id));
    region.addEventListener("mouseenter", () => showTooltip(region.dataset.id));
    region.addEventListener("mouseleave", () => hideTooltip());
  });
}

function showTooltip(id) {
  const label = labels[id] || id;
  tooltip.textContent = label;
  tooltip.hidden = false;
}

function hideTooltip() {
  tooltip.hidden = true;
}

function showDetails(id) {
  const label = labels[id] || id;
  const info = partsData[id] || {};
  details.innerHTML = `
    <h2>${label}</h2>
    <p>${info.description || "No description available."}</p>
  `;
  details.classList.remove("empty");
}

function updateLabels() {
  const regions = svgContainer.querySelectorAll("[data-id]");
  regions.forEach(region => {
    const label = labels[region.dataset.id];
    if (label) region.setAttribute("aria-label", label);
  });
}

function reloadViewer() {
  loadLabels(currentLang);
  loadData();
  loadSVG();
}

// Language switch
langButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    langButtons.forEach(b => b.setAttribute("aria-pressed", "false"));
    btn.setAttribute("aria-pressed", "true");
    currentLang = btn.id === "lang-en" ? "en" : "am";
    reloadViewer();
  });
});

// Species switch
speciesSelect.addEventListener("change", e => {
  document.body.dataset.species = e.target.value;
  reloadViewer();
});

// System switch
systemTabs.forEach(btn => {
  btn.addEventListener("click", () => {
    systemTabs.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    document.body.dataset.system = btn.dataset.system;
    reloadViewer();
  });
});

// Search filter
searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase();
  const regions = svgContainer.querySelectorAll("[data-id]");
  regions.forEach(region => {
    const label = labels[region.dataset.id]?.toLowerCase() || "";
    region.style.opacity = label.includes(query) ? "1" : "0.2";
  });
});

// Initial load
reloadViewer();

