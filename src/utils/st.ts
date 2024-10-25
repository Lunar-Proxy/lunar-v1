document.addEventListener("DOMContentLoaded", () => {
  const pinput = document.getElementById("pinput") as HTMLSelectElement | null;
  const firstSection = document.querySelector(
    "#content-container > div:not(.hidden)",
  ) as HTMLElement | null;
  const bginput = document.getElementById(
    "bg-input",
  ) as HTMLInputElement | null;
  const toggle = document.getElementById(
    "cloak-toggle",
  ) as HTMLInputElement | null;
  const slider = toggle?.nextElementSibling as HTMLElement | null;
  const dot = document.querySelector(".dot") as HTMLElement | null;

  document.querySelectorAll(".setting-btn").forEach((button) => {
    button.addEventListener("click", (event) => {
      const targetElement = event.currentTarget as HTMLElement;
      const target = targetElement.getAttribute("data-target");

      if (target) {
        document
          .querySelectorAll("#content-container > div")
          .forEach((section) => {
            section.classList.add("hidden");
          });
        const targetSection = document.getElementById(target);
        if (targetSection) {
          targetSection.classList.remove("hidden");
        }
      }
    });
  });

  if (!firstSection) {
    const defaultSection = document.getElementById("website");
    if (defaultSection) {
      defaultSection.classList.remove("hidden");
    }
  }

  pinput?.addEventListener("change", function () {
    if (pinput) {
      const option = this.value;
      localStorage.setItem("@lunar/custom/engine", option);
      console.debug("Search engine is set to", option);
      window.location.reload;
    }
  });

  if (pinput) {
    pinput.value =
      localStorage.getItem("@lunar/settings/engine") ||
      "https://www.google.com/search?q=";
  }

  if (bginput) {
    bginput.placeholder =
      localStorage.getItem("@lunar/settings/bg") || "Enter an image URL";
  }

  const utoggle = () => {
    const cloakState = localStorage.getItem("@lunar/settings/ab");
    if (cloakState === "on" || cloakState === null) {
      if (toggle) toggle.checked = true;
      if (slider) {
        slider.classList.add("bg-green-500");
        slider.classList.remove("bg-gray-500");
      }
      if (dot) dot.style.transform = "translateX(100%)";
    } else {
      if (toggle) toggle.checked = false;
      if (slider) {
        slider.classList.add("bg-gray-500");
        slider.classList.remove("bg-green-500");
      }
      if (dot) dot.style.transform = "translateX(0)";
    }
  };

  toggle?.addEventListener("change", () => {
    if (toggle) {
      if (toggle.checked) {
        if (slider) {
          slider.classList.remove("bg-gray-500");
          slider.classList.add("bg-green-500");
        }
        if (dot) dot.style.transform = "translateX(100%)";
        localStorage.setItem("@lunar/settings/ab", "on");
      } else {
        if (slider) {
          slider.classList.remove("bg-green-500");
          slider.classList.add("bg-gray-500");
        }
        if (dot) dot.style.transform = "translateX(0)";
        localStorage.setItem("@lunar/settings/ab", "off");
      }
    }
  });

  utoggle();
});

document.addEventListener("DOMContentLoaded", () => {
  const dropdownToggle = document.getElementById(
    "dropdown-toggle",
  ) as HTMLButtonElement;
  const dropdownMenu = document.getElementById(
    "dropdown-menu",
  ) as HTMLUListElement;
  const selectedOption = document.getElementById(
    "selected-option",
  ) as HTMLSpanElement;

  const savedProxyType = localStorage.getItem("@lunar/settings/engine");
  if (savedProxyType) {
    selectedOption.textContent =
      savedProxyType === "https://www.google.com/search?q="
        ? "Google"
        : "Duckduckgo";
  }

  dropdownToggle.addEventListener("click", () => {
    dropdownMenu.classList.toggle("hidden");
    dropdownMenu.classList.toggle("fade-in");
  });

  dropdownMenu.addEventListener("click", (event) => {
    const target = event.target as HTMLElement;
    if (target.classList.contains("dropdown-item")) {
      const value = target.getAttribute("data-value");

      dropdownMenu.querySelectorAll(".dropdown-item").forEach((item) => {
        item.classList.remove("selected");
      });

      target.classList.add("selected");
      selectedOption.textContent = target.textContent || "";
      if (value) {
        localStorage.setItem("@lunar/settings/engine", value);
      }
      dropdownMenu.classList.add("hidden");
    }
  });

  document.addEventListener("click", (event) => {
    if (
      !dropdownToggle.contains(event.target as Node) &&
      !dropdownMenu.contains(event.target as Node)
    ) {
      dropdownMenu.classList.add("hidden");
    }
  });

  const wispInput: HTMLInputElement | null = document.getElementById(
    "wispserver",
  ) as HTMLInputElement;
  const wispUrl =
    localStorage.getItem("@lunar/settings/wisp") ||
    `${location.protocol === "https:" ? "wss" : "ws"}://${location.host}/ws/`;
  if (wispInput) {
    wispInput.placeholder = wispUrl;
  }
});

document.getElementById("reset-wispserver")?.addEventListener("click", () => {
  const wsInput = document.getElementById("wispserver") as HTMLInputElement;
  wsInput.value = "";
  localStorage.removeItem("@lunar/settings/wisp");
  window.location.reload();
});

document.getElementById("save-wispserver")?.addEventListener("click", () => {
  const wsInput = document.getElementById("wispserver") as HTMLInputElement;
  const wsServer = wsInput.value;
  console.log(`Wisp Server saved: ${wsServer}`);
  localStorage.setItem("@lunar/settings/wisp", `${wsServer}`);
  window.location.reload();
});

document.getElementById("reset-bg-input")?.addEventListener("click", () => {
  const bgInput = document.getElementById("bg-input") as HTMLInputElement;
  bgInput.value = "";
  localStorage.removeItem("@lunar/settings/bg");
  window.location.reload();
});

document.getElementById("save-bg-input")?.addEventListener("click", () => {
  const bgInput = document.getElementById("bg-input") as HTMLInputElement;
  const bgValue = bgInput.value;
  console.log(`Background Image URL saved: ${bgValue}`);
  localStorage.setItem("@lunar/settings/bg", `${bgValue}`);
  window.location.reload();
});
