document.querySelectorAll(".setting-btn").forEach((button) => {
  button.addEventListener("click", (event) => {
    const targetElement = event.currentTarget as HTMLElement; 
    const target = targetElement.getAttribute('data-target');
    
    if (target) {
      document.querySelectorAll("#content-container > div").forEach((section) => {
        section.classList.add("hidden");
      });
      const targetSection = document.getElementById(target);
      if (targetSection) {
        targetSection.classList.remove("hidden");
      }
    }
  });
});

const firstSection = document.querySelector("#content-container > div:not(.hidden)");
if (!firstSection) {
  const defaultSection = document.getElementById("ptype");
  if (defaultSection) {
    defaultSection.classList.remove("hidden");
  }
}