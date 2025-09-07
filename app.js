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

// Sample data - in a real application, this would be in external JSON files
const sampleData = {
  dog: {
    skeleton: {
      skull: {
        description: {
          en: "The skull protects the brain and supports the structures of the face. It consists of the cranium and the mandible.",
          am: "ጭንጫ አእምሮን የሚጠብቅ እና የፊት መዋቅሮችን የሚደግፍ ነው። ክራኒየም እና ማንዲብል ያቀፈ ነው።"
        }
      },
      spine: {
        description: {
          en: "The vertebral column provides support and protects the spinal cord. It consists of cervical, thoracic, lumbar, sacral, and caudal vertebrae.",
          am: "የበቅሎ አጥንት ድጋፍ ይሰጣል እና የጀርባ አገናኙን ይጠብቃል። የአንገት፣ የደረት፣ የወገብ፣ የሳክራል እና የኮዳል አከርካሪዎችን ያቀፈ ነው።"
        }
      },
      ribs: {
        description: {
          en: "The rib cage protects the heart and lungs. Dogs have 13 pairs of ribs.",
          am: "የጎድጎዳ አጥንት ልብን እና ሳንባዎችን ይጠብቃል። ከላቆች 13 ጥንድ ጎድጎዳ አጥንቶች አሏቸው።"
        }
      },
      pelvis: {
        description: {
          en: "The pelvis connects the spinal column to the hind limbs and protects reproductive organs.",
          am: "ወገብ የበቅሎ አጥንት ከኋላ አገናኞች ጋር ያገናኛል እና የወሲብ አካላትን ይጠብቃል።"
        }
      },
      femur: {
        description: {
          en: "The femur is the longest and strongest bone in the body, connecting the hip to the knee.",
          am: "ተንሸራታች አጥንት በሰውነት ውስጥ ረጅሙ እና ጠንካራው አጥንት ነው፣ ወገብን ከጉልበት ጋር ያገናኛል።"
        }
      }
    },
    muscles: {
      masseter: {
        description: {
          en: "The masseter muscle is a powerful muscle that closes the jaw during chewing.",
          am: "የጡረታ ጡንቻ ከፍተኛ ኃይል ያለው ጡንቻ ነው ፣ በሚገጥምበት ጊዜ ሸክላን ይዝጋል።"
        }
      },
      trapezius: {
        description: {
          en: "The trapezius muscle moves the scapula and supports the weight of the forelimbs.",
          am: "የትራፔዚየስ ጡንቻ ስካፑላን ያንቀሳቅሳል እና የፊት አገናኞችን ክብደት ይደግፋል።"
        }
      },
      gluteals: {
        description: {
          en: "The gluteal muscles extend and abduct the hip joint.",
          am: "የግልገል ጡንቻዎች የወገብ መገጣጠሚያን ያራዝማሉ እና ያሰፋሉ።"
        }
      },
      biceps: {
        description: {
          en: "The biceps brachii flexes the elbow joint and supinates the forearm.",
          am: "የቢሴፕስ ጡንቻ የዘንባባ መገጣጠሚያን ያጠፋል እና የፊት ክንድን ያሽከርክራል።"
        }
      }
    },
    organs: {
      heart: {
        description: {
          en: "The heart pumps blood throughout the body, delivering oxygen and nutrients to tissues.",
          am: "ልብ በሰውነት ዙሪያ ደም ይጠምቃል ፣ ኦክሲጅን እና ማጠቢያ ንጥረ ነገሮችን ለቲሹዎች ያቀርባል።"
        }
      },
      lungs: {
        description: {
          en: "The lungs facilitate gas exchange, oxygenating blood and removing carbon dioxide.",
          am: "ሳንባዎች የጋዝ ልውውጥን ያመቻቻሉ ፣ ደምን ኦክሲጅን ያደርጋሉ እና ካርቦን ዳይኦክሳይድን ያስወግዳሉ።"
        }
      },
      liver: {
        description: {
          en: "The liver performs numerous metabolic functions including detoxification and protein synthesis.",
          am: "ጉበት ብዙ የምርት ሥራዎችን ያከናውናል ፣ መርዛምነትን ማነስ እና ፕሮቲን አፈጣጠርን ጨምሮ።"
        }
      },
      stomach: {
        description: {
          en: "The stomach breaks down food mechanically and chemically through secretion of gastric juices.",
          am: "ሆድ ምግብን ሜካኒካል እና ኬሚካል በማድረግ የሆድ ጭማቂዎችን በማፍሰስ ይቀዳል።"
        }
      }
    }
  },
  cat: {
    skeleton: {
      skull: {
        description: {
          en: "Feline skull is shorter and more rounded than canine skull, with large eye sockets.",
          am: "የድመት ጭንጫ ከከላቢ ጭንጫ ያነሰ እና የበለጠ ክብ ያለ ነው ፣ ትላልቅ የዓይን ክንድ አለው።"
        }
      },
      spine: {
        description: {
          en: "Cats have a highly flexible spine with extra lumbar vertebrae for agility and jumping.",
          am: "ድመቶች ለተለዋዋጭነት እና ለመዝለል ተጨማሪ የወገብ አከርካሪዎች ያሉት ከፍተኛ ተለዋዋጭ የበቅሎ አጥንት አላቸው።"
        }
      },
      clavicle: {
        description: {
          en: "Cats have a small floating clavicle (collarbone) that allows for greater shoulder movement.",
          am: "ድመቶች የበለጠ የትከሻ እንቅስቃሴ የሚፈቅድ ትንሽ ተንሳፋፊ ክላቪክል (የትከሻ አጥንት) አላቸው።"
        }
      }
    }
  },
  sheep: {
    skeleton: {
      skull: {
        description: {
          en: "Sheep have a robust skull with horn cores in many breeds and specialized teeth for grazing.",
          am: "በጎች በብዙ ዝርያዎች የቀንድ ኮሮች ያሉት ጠንካራ ጭንጫ እና ለመጋለብ ልዩ ጥርሶች አሏቸው።"
        }
      }
    }
  }
};

const sampleLabels = {
  en: {
    skull: "Skull",
    spine: "Spine",
    ribs: "Ribs",
    pelvis: "Pelvis",
    femur: "Femur",
    masseter: "Masseter Muscle",
    trapezius: "Trapezius Muscle",
    gluteals: "Gluteal Muscles",
    biceps: "Biceps Brachii",
    heart: "Heart",
    lungs: "Lungs",
    liver: "Liver",
    stomach: "Stomach",
    clavicle: "Clavicle"
  },
  am: {
    skull: "ጭንጫ",
    spine: "በቅሎ",
    ribs: "ጎድጎዳ",
    pelvis: "ወገብ",
    femur: "ተንሸራታች",
    masseter: "የጡረታ ጡንቻ",
    trapezius: "የትራፔዚየስ ጡንቻ",
    gluteals: "የግልገል ጡንቻዎች",
    biceps: "የቢሴፕስ ጡንቻ",
    heart: "ልብ",
    lungs: "ሳምባ",
    liver: "ጉበት",
    stomach: "ሆድ",
    clavicle: "ቁርጠት"
  }
};

// Sample SVGs for different systems
const sampleSVGs = {
  skeleton: `
    <svg width="400" height="400" viewBox="0 0 400 400">
      <rect width="100%" height="100%" fill="#1f2937" />
      <text x="50%" y="30" text-anchor="middle" fill="#94a3b8" font-size="16">Skeleton System</text>
      <circle cx="200" cy="100" r="30" class="part" data-id="skull" />
      <path d="M200 130 L200 250" stroke="#64748b" stroke-width="4" class="part" data-id="spine" />
      <path d="M170 150 L130 140 M230 150 L270 140" stroke="#64748b" stroke-width="3" class="part" data-id="ribs" />
      <path d="M190 250 L160 300 M210 250 L240 300" stroke="#64748b" stroke-width="4" class="part" data-id="pelvis" />
      <path d="M160 300 L140 370 M240 300 L260 370" stroke="#64748b" stroke-width="4" class="part" data-id="femur" />
    </svg>
  `,
  muscles: `
    <svg width="400" height="400" viewBox="0 0 400 400">
      <rect width="100%" height="100%" fill="#1f2937" />
      <text x="50%" y="30" text-anchor="middle" fill="#94a3b8" font-size="16">Muscular System</text>
      <ellipse cx="200" cy="100" rx="40" ry="30" class="part" data-id="masseter" />
      <path d="M180 120 Q200 150 220 120" stroke="#64748b" stroke-width="8" fill="none" class="part" data-id="trapezius" />
      <ellipse cx="200" cy="250" rx="35" ry="25" class="part" data-id="gluteals" />
      <path d="M170 150 L150 200" stroke="#64748b" stroke-width="6" class="part" data-id="biceps" />
    </svg>
  `,
  organs: `
    <svg width="400" height="400" viewBox="0 0 400 400">
      <rect width="100%" height="100%" fill="#1f2937" />
      <text x="50%" y="30" text-anchor="middle" fill="#94a3b8" font-size="16">Organ System</text>
      <ellipse cx="200" cy="150" rx="25" ry="20" class="part" data-id="heart" />
      <ellipse cx="180" cy="180" rx="30" ry="15" class="part" data-id="lungs" />
      <path d="M220 200 Q240 220 230 240 Q220 260 200 250 Q180 240 190 220 Q200 200 220 200" fill="#1f2937" stroke="#64748b" stroke-width="1" class="part" data-id="liver" />
      <ellipse cx="200" cy="280" rx="40" ry="25" class="part" data-id="stomach" />
    </svg>
  `
};

function loadLabels(lang) {
  // Use sample data instead of fetching
  labels = sampleLabels[lang] || sampleLabels.en;
  updateLabels();
}

function loadData() {
  const species = document.body.dataset.species;
  const system = document.body.dataset.system;
  
  // Use sample data instead of fetching
  if (sampleData[species] && sampleData[species][system]) {
    partsData = sampleData[species][system];
  } else {
    partsData = {};
    console.warn(`No data available for ${species} ${system}`);
  }
}

function loadSVG() {
  const species = document.body.dataset.species;
  const system = document.body.dataset.system;
  
  // Show loading indicator
  svgContainer.innerHTML = '<div class="loading"></div>';
  
  // Simulate loading delay
  setTimeout(() => {
    // Use sample SVG instead of fetching
    if (sampleSVGs[system]) {
      svgContainer.innerHTML = sampleSVGs[system];
    } else {
      svgContainer.innerHTML = `
        <svg width="400" height="400" viewBox="0 0 400 400">
          <rect width="100%" height="100%" fill="#1f2937" />
          <text x="50%" y="50%" text-anchor="middle" fill="#94a3b8" font-size="16">
            No diagram available for ${system} system
          </text>
        </svg>
      `;
    }
    
    attachSVGListeners();
    updateLabels();
  }, 500);
}

function attachSVGListeners() {
  const regions = svgContainer.querySelectorAll("[data-id]");
  regions.forEach(region => {
    region.addEventListener("click", () => showDetails(region.dataset.id));
    region.addEventListener("mouseenter", (e) => showTooltip(region.dataset.id, e));
    region.addEventListener("mouseleave", () => hideTooltip());
  });
}

function showTooltip(id, event) {
  const label = labels[id] || id;
  tooltip.textContent = label;
  tooltip.hidden = false;
  
  // Position the tooltip near the cursor
  const offset = 15;
  tooltip.style.left = `${event.pageX + offset}px`;
  tooltip.style.top = `${event.pageY + offset}px`;
}

function hideTooltip() {
  tooltip.hidden = true;
}

function showDetails(id) {
  const label = labels[id] || id;
  const info = partsData[id] || {};
  
  // Get description in current language
  let description = "No description available.";
  if (info.description && info.description[currentLang]) {
    description = info.description[currentLang];
  } else if (info.description) {
    // Fallback to English if current language not available
    description = info.description.en || info.description;
  }
  
  details.innerHTML = `
    <h2>${label}</h2>
    <p>${description}</p>
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
    const label = (labels[region.dataset.id] || "").toLowerCase();
    region.style.opacity = label.includes(query) ? "1" : "0.2";
  });
});

// Initial load
reloadViewer();
