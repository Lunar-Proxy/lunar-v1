import { BareMuxConnection } from "@mercuryworkshop/bare-mux";
import setup from "./config.ts";

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

const iframe = document.getElementById("iframe") as HTMLIFrameElement | null;
const bar = document.getElementById("url") as HTMLInputElement | null;
const clear = document.getElementById("clear") as HTMLButtonElement | null;
const favicon = document.getElementById("favicon") as HTMLImageElement | null;
const title = document.getElementById("name") as HTMLTitleElement | null;
const copy = document.getElementById("copy") as HTMLButtonElement | null;
const f = document.getElementById("forward") as HTMLButtonElement | null;
const b = document.getElementById("back") as HTMLButtonElement | null;
const r = document.getElementById("reload") as HTMLButtonElement | null;
let previousUrl: string | undefined;
declare const ScramjetController: any;
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
scram.init("./sjsw.js");

async function frame() {
  const connection = new BareMuxConnection("/bm/worker.js");
  const transport = setup.transport === "ep" ? "/ep/index.mjs" : "/lb/index.mjs";
  if ((await connection.getTransport()) !== transport) {
    console.debug(`Using ${setup.transport === "ep" ? "epoxy" : "libcurl"} transport`);
    await connection.setTransport(transport, [{ wisp: setup.wisp }]);
  }

  setup.proxy === "uv" ? uv() : sj();
}

function validate(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function uv() {
  console.debug("Using UV");
  const newurl = validate(setup.gourl)
    ? setup.gourl.startsWith("http")
      ? setup.gourl
      : `https://${setup.gourl}`
    : setup.engine + encodeURIComponent(setup.gourl);

  if (iframe) {
    iframe.src = `/p/${config.encodeUrl(newurl)}`;
  }
}

function sj() {
  console.debug("Using scramjet (BETA)");
  const newurl = validate(setup.gourl)
    ? setup.gourl.startsWith("http")
      ? setup.gourl
      : `https://${setup.gourl}`
    : setup.engine + encodeURIComponent(setup.gourl);

  if (iframe) {
    iframe.src = `${scram.encodeUrl(newurl)}`;
  }
}

function updateContent() {
  if (iframe) {
    const url = iframe.contentWindow?.__uv$location?.href;
    if (url && url !== previousUrl) {
      const charLimit = limit();
      if (bar) {
        bar.value = url.length > charLimit ? `${url.substring(0, charLimit)}...` : url;
      }
      previousUrl = url;
    }
    let image: string = "";
    if (setup.proxy === "uv") {
      image = `https://www.google.com/s2/favicons?domain=${iframe.contentWindow!.__uv$location?.origin}&sz=24`;
    } else if (setup.proxy === "sj") {
      const cleanedUrl = iframe.contentWindow?.location.href.replace(scram.prefix, "");
      image = `https://www.google.com/s2/favicons?domain=${cleanedUrl}&sz=24`;
    }
    if (favicon) {
      favicon.src = image;
      favicon.onerror = () => {
        favicon.src = "https://www.google.com/s2/favicons?domain=null&sz=24";
      };
    }
    if (title) {
      title.textContent = iframe.contentWindow?.document.title || "";
    }
  } else {
    throw new Error("iframe not found");
  }
}

iframe?.addEventListener("load", () => {
  setInterval(updateContent, 1000);

  bar?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      setup.gourl = bar.value;
      frame();
    }
  });

  clear?.addEventListener("click", () => {
    if (bar) {
      bar.value = "";
      bar.focus();
    }
  });

  copy?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(iframe.contentWindow!.__uv$location?.href || "");
      alert("Copied to clipboard");
    } catch {
      new Error("Failed to copy url to clipboard");
    }
  });

  f?.addEventListener("click", () => {
    iframe.contentWindow?.history.forward();
  });

  b?.addEventListener("click", () => {
    iframe.contentWindow?.history.back();
  });

  r?.addEventListener("click", () => {
    iframe.contentWindow?.location.reload();
  });
});

function limit() {
  const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
  const charWidth = 8;
  return Math.floor(vw / charWidth);
}

frame();
