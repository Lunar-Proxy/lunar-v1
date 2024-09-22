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

const loadingDiv = document.getElementById("loading");
const iframe = document.createElement("iframe");

window.addEventListener("DOMContentLoaded", () => {
  let gourl = localStorage.getItem("@lunar/gourl") || "/p/hvtrs8%2F-Gmoelg.aoo";
  if (iframe) {
    iframe.src = gourl;
    iframe.style.height = "100vh";
    iframe.style.width = "100vw";
    iframe.sandbox.add(
      "allow-same-origin",
      "allow-downloads",
      "allow-scripts",
      "allow-forms",
      "allow-modals",
      "allow-popups",
      "allow-orientation-lock",
      "allow-pointer-lock",
      "allow-presentation",
    );
    document.body.appendChild(iframe);

    iframe.addEventListener("load", () => {
      if (loadingDiv) {
        loadingDiv.style.display = "none";
      }
    });
  }
});

iframe.contentWindow!.open = (url: string): Window | null => {
  let encodedUrl = config.encodeUrl(url);
  sessionStorage.setItem("@lunar/gourl", `/p/${encodedUrl}`);
  Updateurl();
  return null;
};

function Updateurl() {
  if (loadingDiv) {
    loadingDiv.style.display = "block";
  }

  iframe.src = localStorage.getItem("@lunar/gourl") || "";
}
