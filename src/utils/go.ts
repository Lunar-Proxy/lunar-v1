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
const wispurl = `${location.protocol === "https:" ? "wss" : "ws"}://${location.host}/ws/`;

async function updateUrl() {
  const connection = new BareMuxConnection("/bm/worker.js");
  await connection.setTransport("/ep/index.mjs", [{ wisp: wispurl }]);
  const newUrl = localStorage.getItem("@lunar/gourl") || "";
  loadingDiv.style.display = "block";
  iframe.style.display = "none";
  iframe.src = newUrl;
}

(async (): Promise<void> => {
  const connection = new BareMuxConnection("/bm/worker.js");
  await connection.setTransport("/ep/index.mjs", [{ wisp: wispurl }]);
  iframe.src = gourl;
  iframe.onload = () => {
    iframe.style.display = "block";
    loadingDiv.style.display = "none";

    const iframeWindow = iframe.contentWindow;
    if (iframeWindow) {
      iframeWindow.open = (url: string) => {
        console.log("URL:", url);
        let newurl = config.encodeUrl(url);
        localStorage.setItem("@lunar/gourl", `/p/${newurl}`);
        updateUrl();
        return null;
      };
    }
  };
})();
