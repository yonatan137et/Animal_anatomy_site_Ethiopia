document.addEventListener("DOMContentLoaded", () => {
  const species = document.body.dataset.species;
  const system = document.body.dataset.system;
  const svgPath = `../svg/${species}/${system}.svg`;
  const dataPath = `../data/${species}/${system}.json`;
  const langSelector = document.getElementById("languageSelector");
  let currentLang = "en";
  let anatomyData = {};
  let uiLabels = {};

  // Load UI labels
  function loadLabels(lang) {
    fetch(`../i18n/ui.${lang}.json`)
      .then(res => res.json())
      .then(labels => {
        uiLabels = labels;
        document.getElementById("title").textContent = labels[`title${capitalize(species)}${capitalize(system)}`] || `${capitalize(species)} — ${capitalize(system)}`;
        document.getElementById("clickHint").textContent = labels.clickHint;
        document.getElementById("languageLabel").textContent = labels.language;
      });
  }

  // Load anatomy data
  function loadData() {
    fetch(dataPath)
      .then(res => res.json())
      .then(data => {
        anatomyData = data;
      });
  }

  // Load SVG and attach click handlers
  function loadSVG() {
    fetch(svgPath)
      .then(res => res.text())
      .then(svgText => {
        document.getElementById("svgContainer").innerHTML = svgText;
        const svg = document.querySelector("#svgContainer svg");
        Object.keys(anatomyData).forEach(id => {
          const part = svg.getElementById(id);
          if (part) {
            part.style.cursor = "pointer";
            part.addEventListener("click", () => showInfo(id));
          }
        });
      });
  }

  // Show info box
  function showInfo(id) {
    const info = anatomyData[id];
    if (!info) return;
    document.getElementById("infoBox").innerHTML = `
      <h2>${info.name[currentLang]}</h2>
      <p><strong>${uiLabels.function}:</strong> ${info.function[currentLang]}</p>
      <p><strong>${uiLabels.context}:</strong> ${info.context[currentLang]}</p>
    `;
  }

  // Language switching
  langSelector.addEventListener("change", (e) => {
    currentLang = e.target.value;
    loadLabels(currentLang);
  });

  // Capitalize helper
  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // Initialize
  loadLabels(currentLang);
  loadData();
  loadSVG();
});
