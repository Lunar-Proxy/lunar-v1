import { BareMuxConnection } from "@mercuryworkshop/bare-mux";
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("./sw.js", { scope: "/p/" })
    .then(({ scope }) => console.debug("SW registered with scope:", scope))
    .catch((error) => console.error("SW registration failed:", error));
}
const iframe = document.getElementById("iframe") as HTMLIFrameElement;
const wispurl =
  localStorage.getItem("@lunar/settings/wisp") ||
  `${location.protocol === "https:" ? "wss" : "ws"}://${location.host}/goo/`;
const transport = localStorage.getItem("@lunar/settings/transport");
const connection = new BareMuxConnection("/bm/worker.js");
    console.debug("Using epoxy transport");
    await connection.setTransport("/ep/index.mjs", [{ wisp: wispurl }]);
  let url = localStorage.getItem("@lunar/gourl") || "https://google.com";
  iframe.src = `/p/${config.encodeUrl(url)}`;



