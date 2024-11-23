import { Settings } from "../utils/config";
import { BareMuxConnection } from "@mercuryworkshop/bare-mux";

await navigator.serviceWorker.register("/sw.js");

const input = document.getElementById("input") as HTMLInputElement;
const fm = document.getElementById("form") as HTMLFormElement;
const frame = document.getElementById("frame") as HTMLIFrameElement;
const loading = document.getElementById("loading") as HTMLDivElement;
const welcome = document.getElementById("starting") as HTMLDivElement;

async function launch(link: string, backend: string) {
  const connection = new BareMuxConnection("/bm/worker.js");
  const wispurl =
    (location.protocol === "https:" ? "wss" : "ws") +
    "://" +
    location.host +
    "/w/";
  if ((await connection.getTransport()) !== "/ep/index.mjs") {
    await connection.setTransport("/ep/index.mjs", [{ wisp: wispurl }]);
  }
  const scram = new ScramjetController({
    prefix: "/sj/",
    files: {
      wasm: "/assets/s/wasm.js",
      worker: "/assets/s/worker.js",
      client: "/assets/s/client.js",
      shared: "/assets/s/shared.js",
      sync: "/assets/s/sync.js",
    },
  });

  window.sj = scram;
  scram.init("./sw.js");
  const url = backend + config.encodeUrl(link);
  frame.src = url;
}

function validate(url: string): boolean {
  const rgex = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return rgex.test(url);
}

fm.addEventListener("submit", async (event) => {
  event.preventDefault();
  welcome.classList.add("hidden");
  loading.classList.remove("hidden");
  let value = input.value;
  const engine = await Settings.get("search-engine");
  if (validate(value)) {
    if (!/^https?:\/\//i.test(value)) {
      value = "https://" + value;
    }
  } else {
    value = engine + value;
  }

  launch(value, await Settings.get("backend"));
});

frame.onload = () => {
  loading.classList.add("hidden");
};

window.history.replaceState?.("", "", window.location.href);
