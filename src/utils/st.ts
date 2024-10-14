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

const firstSection = document.querySelector(
  "#content-container > div:not(.hidden)",
);
if (!firstSection) {
  const defaultSection = document.getElementById("ptype");
  if (defaultSection) {
    defaultSection.classList.remove("hidden");
  }
}

const bginput = document.getElementById("bg-input") as HTMLInputElement;
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
const pinput = document.getElementById("pinput") as HTMLOptionElement;

pinput?.addEventListener("change", function () {
  const option = this.value;
  localStorage.setItem("@lunar/custom/ptype", option);
  console.debug("Proxy type set to", option);
});

pinput.value = localStorage.getItem("@lunar/custom/ptype") || "uv";
bginput.placeholder =
  localStorage.getItem("@lunar/custom/bg") || "Enter an image URL";
