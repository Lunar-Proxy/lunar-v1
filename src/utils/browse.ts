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

const iframe = document.getElementById("iframe") as HTMLIFrameElement;
let bar = document.getElementById("url") as HTMLInputElement;
let previousUrl: string;
let clear = document.getElementById("clear") as HTMLButtonElement;
let favicon = document.getElementById("favicon") as HTMLImageElement;
let title = document.getElementById("name") as HTMLTitleElement;
let copy = document.getElementById("copy") as HTMLButtonElement;
let f = document.getElementById("forward") as HTMLButtonElement;
let b = document.getElementById("back") as HTMLButtonElement;
let r = document.getElementById("reload") as HTMLButtonElement;
// @ts-ignore
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
  if (setup.transport === "ep") {
    if ((await connection.getTransport()) !== "/ep/index.mjs") {
      console.debug("Using epoxy transport");
      await connection.setTransport("/ep/index.mjs", [{ wisp: setup.wisp }]);
    }
  } else {
    if ((await connection.getTransport()) !== "/lb/index.mjs") {
      console.debug("Using libcurl transport");
      await connection.setTransport("/lb/index.mjs", [{ wisp: setup.wisp }]);
    }
  }

  if (setup.proxy === "uv") {
    uv();
  } else if (setup.proxy === "sj") {
    sj();
  }
}
// setup
function validate(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
}

function uv() {
  let newurl: string;
  console.debug("Using UV");

  if (validate(setup.gourl)) {
    if (!/^https?:\/\//i.test(setup.gourl)) {
      newurl = `https://${setup.gourl}`;
    } else {
      newurl = setup.gourl;
    }
  } else {
    newurl = setup.engine + encodeURIComponent(setup.gourl);
  }

  iframe.src = `/p/${config.encodeUrl(newurl)}`;
}

function sj() {
  let newurl: string;
  console.debug("Using scramjet (BETA)");

  if (validate(setup.gourl)) {
    if (!/^https?:\/\//i.test(setup.gourl)) {
      newurl = `https://${setup.gourl}`;
    } else {
      newurl = setup.gourl;
    }
  } else {
    newurl = setup.engine + encodeURIComponent(setup.gourl);
  }

  iframe.src = `${scram.encodeUrl(newurl)}`;
}

// Nav Bar setup
iframe.onload = function () {
  const updateContent = () => {
    if (iframe) {
      let url = iframe.contentWindow?.__uv$location?.href;
      if (url && url !== previousUrl) {
        const charLimit = limit();
        bar.value =
          url.length > charLimit ? url.substring(0, charLimit) + "..." : url;
        previousUrl = url;
      }

      const image = `https://www.google.com/s2/favicons?domain=${iframe.contentWindow!.__uv$location?.origin}&sz=24`;
      favicon.src = image;
      favicon.onerror = () => {
        favicon.src = "https://www.google.com/s2/favicons?domain=null&sz=24";
      };
      title.textContent = iframe.contentWindow?.document.title || "";
    } else {
      throw new Error("iframe not found");
    }
  };
  setInterval(updateContent, 1000);

  if (bar) {
    bar.onkeydown = (e) => {
      if (e.key === "Enter") {
        let Inputurl = bar.value;
        setup.gourl = Inputurl;
        frame();
      }
    };
  }

  if (clear) {
    clear.addEventListener("click", () => {
      bar.value = "";
      bar.focus();
    });
  }

  if (copy) {
    copy.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(
          iframe.contentWindow!.__uv$location?.href || "",
        );
        alert("Copied to clipboard");
      } catch (error) {
        new Error("Failed to copy url to clipboard");
      }
    });
  }

  if (f) {
    f.addEventListener("click", () => {
      iframe.contentWindow?.history.forward();
    });
  }

  if (b) {
    b.addEventListener("click", () => {
      iframe.contentWindow?.history.back();
    });
  }

  if (r) {
    r.addEventListener("click", () => {
      iframe.contentWindow?.location.reload();
    });
  }
};

function limit() {
  const vw = Math.max(
    document.documentElement.clientWidth || 0,
    window.innerWidth || 0,
  );
  const charWidth = 8;
  return Math.floor(vw / charWidth);
}

frame();
