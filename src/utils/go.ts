import { BareMuxConnection } from "@mercuryworkshop/bare-mux";

const iframe = document.getElementById("iframe") as HTMLIFrameElement;
const wispurl =
  localStorage.getItem("@lunar/settings/wisp") ||
  `${location.protocol === "https:" ? "wss" : "ws"}://${location.host}/goo/`;
const transport = localStorage.getItem("@lunar/settings/transport");
const connection = new BareMuxConnection("/bm/worker.js");

async function frame() {
  if (transport === "ep") {
    console.debug("Using epoxy transport");
    await connection.setTransport("/ep/index.mjs", [{ wisp: wispurl }]);
  } else if (transport === "lc") {
    console.debug("Using libcurl transport");
    await connection.setTransport("/lb/index.mjs", [{ wisp: wispurl }]);
  } else {
    console.error("No valid transport found, defaulting to epoxy...");
    await connection.setTransport("/ep/index.mjs", [{ wisp: wispurl }]);
  }

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("./sw.js", { scope: "/p/" })
      .then(({ scope }) => console.debug("SW registered with scope:", scope))
      .catch((error) => console.error("SW registration failed:", error));
  }
  let url = localStorage.getItem("@lunar/gourl") || "https://google.com";
  iframe.src = `/p/${config.encodeUrl(url)}`;
}

if (iframe.contentWindow) {
  iframe.contentWindow.open = (url: string) => {
    console.debug("new url:", url);
    localStorage.setItem("@lunar/gourl", url);
    frame();
    return null;
  };
}

frame();