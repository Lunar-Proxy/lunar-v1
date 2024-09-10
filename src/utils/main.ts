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

  const fm = document.getElementById("sear");
  const input = document.getElementById("input");
  fm.addEventListener("submit", (event) => {
    event.preventDefault();
    localStorage.setItem(
      "@lunar/gourl",
      "/p/" + config.encodeUrl(input.value.trim()),
    );
    window.location.href = "./go";
  });