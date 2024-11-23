import { Settings } from "../utils/config";
import { BareMuxConnection } from "@mercuryworkshop/bare-mux";

   async function init() {
  await Settings();
}

init()

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

const input = document.getElementById("input") as HTMLInputElement;
const fm = document.getElementById("form") as HTMLFormElement;
const frame = document.getElementById("frame") as HTMLIFrameElement;
const loading = document.getElementById("loading") as HTMLDivElement;
const welcome = document.getElementById("starting") as HTMLDivElement;

async function launch(link: string) {
  const connection = new BareMuxConnection("/bm/worker.js");
  const wispurl = (location.protocol  === "https:" ? "wss" : "ws") +
    "://" +
    location.host +
    "/w/";
  if ((await connection.getTransport()) !== "/ep/index.mjs") {
    await connection.setTransport("/ep/index.mjs", [{ wisp: wispurl }]);
  }
  const url = "/p/" + config.encodeUrl(link);
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
  if (value.startsWith("lunar://")) {
    return;
  }

  if (validate(value)) {
    if (!/^https?:\/\//i.test(value)) {
      value = "https://" + value;
    }
  } else {
    value = engine + value;
  }

  launch(value);
});


frame.onload = () => {
  loading.classList.add("hidden");
 
};

window.history.replaceState?.("", "", window.location.href);
