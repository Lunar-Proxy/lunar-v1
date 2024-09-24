import { BareMuxConnection } from "@mercuryworkshop/bare-mux";

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

const loadingDiv = document.getElementById("loading") as HTMLElement;
const iframe = document.createElement("iframe") as HTMLIFrameElement;

const gourl = localStorage.getItem("@lunar/gourl") || "/p/hvtrs8%2F-Gmoelg.aoo";
const wispurl =
  (location.protocol === "https:" ? "wss" : "ws") +
  "://" +
  location.host +
  "/w/";

const connection = new BareMuxConnection("/bm/worker.js");
await connection.setTransport("/ep/index.mjs", [{ wisp: wispurl }]);

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
  loadingDiv.style.display = "none";
});

iframe.contentWindow!.open = (url: string): Window | null => {
  let encodedUrl = config.encodeUrl(url);
  sessionStorage.setItem("@lunar/gourl", `/p/${encodedUrl}`);
  Updateurl();
  return null;
};

function Updateurl() {
  if (loadingDiv) loadingDiv.style.display = "block";
  iframe.src = localStorage.getItem("@lunar/gourl") || "";
}
