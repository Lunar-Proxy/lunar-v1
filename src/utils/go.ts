import { BareMuxConnection } from "@mercuryworkshop/bare-mux";

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("./sw.js", { scope: "/p/" })
    .then(({ scope }) =>
      console.log("Service Worker registered with scope:", scope),
    )
    .catch((error) =>
      console.error("Service Worker registration failed:", error),
    );
}

const loadingDiv = document.getElementById("loading")!;
const iframe = document.createElement("iframe");
const gourl = localStorage.getItem("@lunar/gourl") || "/p/hvtrs8%2F-Gmoelg.aoo";
const wispurl = `${location.protocol === "https:" ? "wss" : "ws"}://${location.host}/w/`;

const connection = new BareMuxConnection("/bm/worker.js");

(async () => {
  await connection.setTransport("/ep/index.mjs", [{ wisp: wispurl }]);

  iframe.src = gourl;
  Object.assign(iframe.style, {
    width: "100vw",
    height: "100vh",
    border: "none",
    outline: "none",
    top: "0",
    bottom: "0",
    left: "0",
    right: "0",
    position: "fixed",
  });

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

  iframe.onload = () => {
    loadingDiv.style.display = "none";
  };

  iframe.contentWindow!.open = (url: string) => {
    sessionStorage.setItem("@lunar/gourl", `/p/${config.encodeUrl(url)}`);
    UpdateUrl();
    return null;
  };
})();

function UpdateUrl() {
  loadingDiv.style.display = "block";
  iframe.src = localStorage.getItem("@lunar/gourl") || "";
}
