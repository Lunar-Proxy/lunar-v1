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
      localStorage.setItem("@lunar/settings/engine", option);
      console.debug("Search engine is set to", option);
      window.location.reload();
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

  const engineDropdownToggle = document.getElementById(
    "engine-dropdown-toggle",
  ) as HTMLButtonElement;
  const engineDropdownMenu = document.getElementById(
    "engine-dropdown-menu",
  ) as HTMLUListElement;
  const selectedEngine = document.getElementById(
    "selected-engine",
  ) as HTMLSpanElement;

  if (selectedEngine) {
    const savedEngine = localStorage.getItem("@lunar/settings/engine");
    if (savedEngine) {
      const currentItem = engineDropdownMenu.querySelector(
        `[data-value="${savedEngine}"]`,
      );
      if (currentItem) {
        selectedEngine.textContent = currentItem.textContent;
      }
    }
  }

  engineDropdownToggle?.addEventListener("click", () => {
    engineDropdownMenu?.classList.toggle("hidden");
    engineDropdownMenu?.classList.toggle("fade-in");
  });

  engineDropdownMenu?.addEventListener("click", (event) => {
    const target = event.target as HTMLElement;
    if (target.classList.contains("dropdown-item")) {
      const value = target.getAttribute("data-value");

      engineDropdownMenu.querySelectorAll(".dropdown-item").forEach((item) => {
        item.classList.remove("selected");
      });

      target.classList.add("selected");
      if (selectedEngine) {
        selectedEngine.textContent = target.textContent || "";
      }
      if (value) {
        localStorage.setItem("@lunar/settings/engine", value);
      }
      engineDropdownMenu.classList.add("hidden");
    }
  });

  document.addEventListener("click", (event) => {
    if (
      !engineDropdownToggle?.contains(event.target as Node) &&
      !engineDropdownMenu?.contains(event.target as Node)
    ) {
      engineDropdownMenu?.classList.add("hidden");
    }
  });

  const wispInput: HTMLInputElement | null = document.getElementById(
    "wispserver",
  ) as HTMLInputElement;
  const wispUrl =
    localStorage.getItem("@lunar/settings/wisp") ||
    `${location.protocol === "https:" ? "wss" : "ws"}://${location.host}/p/`;
  if (wispInput) {
    wispInput.placeholder = wispUrl;
  }

  const proxyDropdownToggle = document.getElementById("proxy-dropdown-toggle");
  const proxyDropdownMenu = document.getElementById("proxy-dropdown-menu");
  const selectedProxy = document.getElementById("selected-proxy");

  if (proxyDropdownToggle && proxyDropdownMenu && selectedProxy) {
    proxyDropdownToggle.addEventListener("click", () => {
      proxyDropdownMenu.classList.toggle("hidden");
    });

    document.addEventListener("click", (event) => {
      if (
        !proxyDropdownToggle.contains(event.target as Node) &&
        !proxyDropdownMenu.contains(event.target as Node)
      ) {
        proxyDropdownMenu.classList.add("hidden");
      }
    });

    proxyDropdownMenu.querySelectorAll(".dropdown-item").forEach((item) => {
      item.addEventListener("click", (event) => {
        const targetElement = event.currentTarget as HTMLElement;
        const value = targetElement.getAttribute("data-value");
        if (value) {
          localStorage.setItem("@lunar/settings/ptype", value);
          selectedProxy.textContent = targetElement.textContent;
          proxyDropdownMenu.classList.add("hidden");
          console.log(`Proxy set to: ${value}`);
        }
      });
    });

    const currentProxy = localStorage.getItem("@lunar/settings/ptype");
    if (currentProxy) {
      const currentItem = proxyDropdownMenu.querySelector(
        `[data-value="${currentProxy}"]`,
      );
      if (currentItem) {
        selectedProxy.textContent = currentItem.textContent;
      }
    }
  }

  const transportDropdownToggle = document.getElementById(
    "transport-dropdown-toggle",
  );
  const transportDropdownMenu = document.getElementById(
    "transport-dropdown-menu",
  );
  const selectedTransport = document.getElementById("selected-transport");

  if (transportDropdownToggle && transportDropdownMenu && selectedTransport) {
    transportDropdownToggle.addEventListener("click", () => {
      transportDropdownMenu.classList.toggle("hidden");
    });

    document.addEventListener("click", (event) => {
      if (
        !transportDropdownToggle.contains(event.target as Node) &&
        !transportDropdownMenu.contains(event.target as Node)
      ) {
        transportDropdownMenu.classList.add("hidden");
      }
    });

    transportDropdownMenu.querySelectorAll(".dropdown-item").forEach((item) => {
      item.addEventListener("click", (event) => {
        const targetElement = event.currentTarget as HTMLElement;
        const value = targetElement.getAttribute("data-value");
        if (value) {
          localStorage.setItem("@lunar/settings/ptype", value);
          selectedTransport.textContent = targetElement.textContent;
          transportDropdownMenu.classList.add("hidden");
          console.log(`Transport set to: ${value}`);
        }
      });
    });

    const currentTransport = localStorage.getItem("@lunar/settings/ptype");
    if (currentTransport) {
      const currentItem = transportDropdownMenu.querySelector(
        `[data-value="${currentTransport}"]`,
      );
      if (currentItem) {
        selectedTransport.textContent = currentItem.textContent;
      }
    }
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
