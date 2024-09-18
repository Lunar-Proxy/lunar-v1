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
const regex = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/.*)?$/;

fm.addEventListener("submit", (event) => {
  event.preventDefault();
  let value = input.value.trim();
  let url = "";
  if (regex.test(value)) {
    if (!/^https?:\/\//i.test(url)) {
      url = `https://${value}`;
    }
  } else {
    url = `https://www.google.com/search?q=${encodeURIComponent(value)}`;
  }

  // @ts-ignore
  localStorage.setItem("@lunar/gourl", `/p/${config.encodeUrl(url)}`);
  window.location.href = "./go";
});
