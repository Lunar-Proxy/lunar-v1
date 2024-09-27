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
const iframe = document.getElementById("iframe") as HTMLIFrameElement;
const gourl = localStorage.getItem("@lunar/gourl") || "/p/hvtrs8%2F-Gmoelg.aoo";
const wispurl = `${location.protocol === "https:" ? "wss" : "ws"}://${location.host}/w/`;
const connection = new BareMuxConnection("/bm/worker.js");

(async () => {
  await connection.setTransport("/ep/index.mjs", [{ wisp: wispurl }]);
  iframe.src = gourl;
  iframe.onload = () => {
    iframe.style.display = "block";
    loadingDiv.style.display = "none";
    try {
      const iframeWindow = iframe.contentWindow;
      if (iframeWindow) {
        iframeWindow.open = (url: string) => {
          console.log("URL:", url);
          localStorage.setItem("@lunar/gourl", `/p/${config.encodeUrl(url)}`);
          UpdateUrl();
          return null;
        };
      }
    } catch (error) {
      console.error("Unable to update url", error);
    }
  };
})();

function UpdateUrl() {
  iframe.style.display = "none";
  loadingDiv.style.display = "block";
  iframe.src = localStorage.getItem("@lunar/gourl") || "";
}
