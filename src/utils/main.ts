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
const urlPattern =
  /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/.*)?$/;

fm.addEventListener("submit", (event) => {
  event.preventDefault();
  const value = input.value.trim();

  let url;
  if (urlPattern.test(value)) {
    url = value;
  } else {
    url = `https://www.google.com/search?q=${encodeURIComponent(value)}`;
  }
  // @ts-ignore
  localStorage.setItem("@lunar/gourl", `/p/${config.encodeUrl(url)}`);
  window.location.href = "./go";
});
