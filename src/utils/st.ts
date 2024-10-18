const pinput = document.getElementById("pinput") as HTMLOptionElement;
const firstSection = document.querySelector(
  "#content-container > div:not(.hidden)",
);
const bginput = document.getElementById("bg-input") as HTMLInputElement;
const tinput = document.getElementById("Tinput") as HTMLOptionElement;
const toggle = document.getElementById("cloak-toggle") as HTMLInputElement;
const slider = toggle.nextElementSibling as HTMLElement;
const dot = document.getElementById(".dot") as HTMLElement;

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

bginput.addEventListener("input", function () {
  const bgvalue = bginput.value.toLowerCase();
  const regex = /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|bmp|svg|webp|ico))$/;

  if (regex.test(bgvalue)) {
    localStorage.setItem("@lunar/custom/bg", bgvalue);
  } else {
    localStorage.removeItem("@lunar/custom/bg");
    throw new Error("Invalid URL");
  }
});

pinput?.addEventListener("change", function () {
  const option = this.value;
  localStorage.setItem("@lunar/custom/proxy", option);
  console.debug("Proxy type set to", option);
});

tinput?.addEventListener("change", function () {
  const option = this.value;
  localStorage.setItem("@lunar/custom/transport", option);
  console.debug("Transport set to", option);
});

pinput.value = localStorage.getItem("@lunar/custom/proxy") || "uv";
tinput.value = localStorage.getItem("@lunar/custom/transport") || "lc";
bginput.placeholder =
  localStorage.getItem("@lunar/custom/bg") || "Enter an image URL";

const utoggle = () => {
  const cloakState = localStorage.getItem("@lunar/cloak/ab");
  if (cloakState === "on") {
    toggle.checked = true;
    slider.classList.add("bg-green-500");
    slider.classList.remove("bg-gray-500");
    dot.style.transform = "translateX(100%)";
  } else {
    toggle.checked = false;
    slider.classList.add("bg-gray-500");
    slider.classList.remove("bg-green-500");
    dot.style.transform = "translateX(0)";
  }
};

toggle.addEventListener("change", () => {
  if (toggle.checked) {
    slider.classList.remove("bg-gray-500");
    slider.classList.add("bg-green-500");
    dot.style.transform = "translateX(100%)";
    localStorage.setItem("@lunar/cloak/ab", "on");
  } else {
    slider.classList.remove("bg-green-500");
    slider.classList.add("bg-gray-500");
    dot.style.transform = "translateX(0)";
    localStorage.setItem("@lunar/cloak/ab", "off");
  }
});

utoggle();
