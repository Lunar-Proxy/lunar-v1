import { BareMuxConnection } from "@mercuryworkshop/bare-mux";
import { Settings } from "@src/utils/config";

const exit = document.getElementById("return") as HTMLButtonElement;
const refresh = document.getElementById("rotate") as HTMLButtonElement;
const frame = document.getElementById("display") as HTMLIFrameElement;
const full = document.getElementById("maximize") as HTMLButtonElement;
const launch = document.getElementById("game-frame") as HTMLDivElement;

export async function launch2(link: string) {
  const scram = new ScramjetController({
    prefix: "/scram/",
    files: {
      wasm: "/assets/sj/wasm.js",
      worker: "/assets/sj/worker.js",
      client: "/assets/sj/client.js",
      shared: "/assets/sj/shared.js",
      sync: "/assets/sj/sync.js",
    },
  });
  window.sj = scram;
  scram.init("./sjsw.js");
const connection = new BareMuxConnection("/bm/worker.js");
const wispurl =
  (location.protocol === "https:" ? "wss" : "ws") +
  "://" +
  location.host +
  "/w/";
  const transport = await Settings.get("transport");
  const backend = await Settings.get("backend");
if (transport == "ep") {
  if ((await connection.getTransport()) !== "/ep/index.mjs") {
    await connection.setTransport("/ep/index.mjs", [{ wisp: wispurl }]);
    console.debug("Transport is set to Epoxy");
  }
} else {
  if ((await connection.getTransport()) !== "/lb/index.mjs") {
    await connection.setTransport("/lb/index.mjs", [{ wisp: wispurl }]);
    console.debug("Transport is set to Libcurl");
  }
}

const url = backend === '/p/' 
? backend + UltraConfig.encodeUrl(link) 
: scram.encodeUrl(link);

frame.src = url;
}

exit.addEventListener("click", () => {
  frame.src = "about:blank";
  launch.classList.add("hidden");
})

refresh.addEventListener("click", () => {
  frame.contentWindow!.location.reload();
})

full.addEventListener("click", () => {
  launch.requestFullscreen();
})