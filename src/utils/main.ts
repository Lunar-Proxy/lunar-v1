if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./sw.js", { scope: "/p/" })
      .then(({ scope }) =>
        console.log(
          "Successfully registered Service Workers with scope:",
          scope,
        ),
      )
      .catch((error) =>
        console.error("Failed to register Service Worker:", error),
      );
  });
}
const fm = document.getElementById("sear") as HTMLFormElement;
const input = document.getElementById("input") as HTMLInputElement;
fm.addEventListener("submit", (event) => {
  event.preventDefault();
  const value = input.value.trim() as string;
  const urlPattern =
    /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/.*)?$/;
  if (urlPattern.test(value)) {
    // @ts-ignore
    localStorage.setItem("@lunar/gourl", "/p/" + config.encodeUrl(value));
    window.location.href = "./go";
  } else {
    localStorage.setItem(
      "@lunar/gourl",
      "/p/" +
        // @ts-ignore
        config.encodeUrl(
          `https://www.google.com/search?q=${encodeURIComponent(value)}`,
        ),
    );
    window.location.href = "./go";
  }
});
