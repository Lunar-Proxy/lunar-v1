import { BareMuxConnection } from "@mercuryworkshop/bare-mux";

const iframe = document.getElementById("iframe") as HTMLIFrameElement;
const wispurl =
  localStorage.getItem("@lunar/settings/wisp") ||
  `${location.protocol === "https:" ? "wss" : "ws"}://${location.host}/s/`;
const transport = localStorage.getItem("@lunar/settings/transport");
const connection = new BareMuxConnection("/bm/worker.js");

async function frame() {
  if (iframe) {
    if (transport === "ep") {
      await connection.setTransport("/e/index.mjs", [{ wisp: wispurl }]);
    } else if (transport === "lc") {
      await connection.setTransport("/l/index.mjs", [{ wisp: wispurl }]);
    }
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("./sw.js", { scope: "/p/" })
        .then(({ scope }) =>
          console.debug("Service Worker registered with scope:", scope),
        )
        .catch((error) =>
          console.error("Service Worker registration failed:", error),
        );
    }

    let url = localStorage.getItem("@lunar/gourl") || "https://google.com";
    iframe.src = `/p/${config.encodeUrl(url)}`;
  }
}

if (iframe.contentWindow) {
  iframe.contentWindow.open = (url: string) => {
    console.debug("Opening new page with the url:", url);
    localStorage.setItem("@lunar/gourl", url);
    frame();
    return null;
  };
}

frame();
