import { BareMuxConnection } from "@mercuryworkshop/bare-mux";

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("./sw.js", { scope: "/us/" })
    .then(({ scope }) =>
      console.debug("Service Worker registered with scope:", scope),
    )
    .catch((error) =>
      console.error("Service Worker registration failed:", error),
    );
}

const loadingDiv = document.getElementById("loading")!;
const iframe = document.getElementById("iframe") as HTMLIFrameElement;
const gourl =
  localStorage.getItem("@lunar/gourl") || "/us/hvtrs8%2F-Gmoelg.aoo";
const wispurl = `${location.protocol === "https:" ? "wss" : "ws"}://${location.host}/ws/`;
const tType = localStorage.getItem("@lunar/custom/transport");
let connection = new BareMuxConnection("/bm/worker.js");

async function updateUrl() {
  if (tType === "ep") {
    await connection.setTransport("/ep/index.mjs", [{ wisp: wispurl }]);
  } else if (tType === "lc") {
    await connection.setTransport("/lc/index.mjs", [{ wisp: wispurl }]);
  }
  const newUrl = localStorage.getItem("@lunar/gourl") || "";
  console.debug("New URL", newUrl);
  loadingDiv.classList.remove("hidden");
  iframe.classList.add("hidden");
  iframe.src = newUrl;
}

(async (): Promise<void> => {
  if (tType === "ep") {
    await connection.setTransport("/ep/index.mjs", [{ wisp: wispurl }]);
    console.debug("Using default transport (Epoxy)");
  } else if (tType === "lc") {
    await connection.setTransport("/lc/index.mjs", [{ wisp: wispurl }]);
    console.debug("Using transport libcurl");
  }

  iframe.src = gourl;
  iframe.onload = () => {
    loadingDiv.classList.add("hidden");
    iframe.classList.remove("hidden");

    const iframeWindow = iframe.contentWindow;
    if (iframeWindow) {
      iframeWindow.open = (url: string) => {
        console.debug("Opening new page with the url:", url);
        const newUrl = config.encodeUrl(url);
        localStorage.setItem("@lunar/gourl", `/us/${newUrl}`);
        updateUrl();
        return null;
      };
    }
  };
})();
