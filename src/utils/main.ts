// Register the service worker if supported
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./sw.js", { scope: "/p/" })
      .then(({ scope }) =>
        console.log("Service Worker registered with scope:", scope),
      )
      .catch((error) =>
        console.error("Service Worker registration failed:", error),
      );
  });
}

// Get form and input elements
const form = document.getElementById("sear") as HTMLFormElement;
const input = document.getElementById("input") as HTMLInputElement;

// Handle form submission
form.addEventListener("submit", (event) => {
  event.preventDefault();

  const inputValue = input.value.trim();
  const url = /^(https?:\/\/)/.test(inputValue)
    ? inputValue
    : /^https?:\/\/.+$/.test(`https://${inputValue}`)
      ? `https://${inputValue}`
      : `https://www.google.com/search?q=${encodeURIComponent(inputValue)}`;
  // @ts-ignore
  localStorage.setItem("@lunar/gourl", `/p/${config.encodeUrl(url)}`);
  window.location.href = "./go";
});
