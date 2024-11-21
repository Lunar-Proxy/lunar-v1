import { BareMuxConnection } from "@mercuryworkshop/bare-mux";
import settings from "../utils/config"
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

const input = document.getElementById("inp") as HTMLInputElement;
const fm = document.getElementById("fm") as HTMLFormElement;
const frame = document.getElementById("frame") as HTMLIFrameElement;
const loading = document.getElementById("loading") as HTMLDivElement;
const welcome = document.getElementById("starting") as HTMLDivElement;

fm.addEventListener("submit", (event) => {
  event.preventDefault();
  let value = input.value;
  if (value.startsWith("lunar://")) {
    pagecheck(value);
    return;
  }
  welcome.classList.add("hidden");
  loading.classList.remove("hidden");
  event.preventDefault();
  if (validate(value)) {
    if (!/^https?:\/\//i.test(value)) {
      value = "https://" + value;
    }
  } else {
    value = settings.prefences.searchengine || "https://www.google.com/search?q=" + value;
  }
  launch(value);
});

async function launch(link: string) {
  const connection = new BareMuxConnection("/bm/worker.js");
  const wispurl = (location.protocol === "https:" ? "wss" : "ws") +
    "://" +
    location.host +
    "/goo/";
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

const interceptLinks = (win = window) => {
  console.log("working??");
  win.open = new Proxy(win.open, {
      apply(_target, _thisArg, argArray) {
          if (argArray[0]) {
              launch(argArray[0]);
              return;
          }
          return;
      },
  });
  
win.addEventListener("click", (e) => {
  const target = e.target as HTMLElement;
  if (target && target.tagName == "A" && target.hasAttribute("href")) {
      let isNewTab =
          (target.hasAttribute("target") &&
              target.getAttribute("target")?.includes("_blank"));

      if (isNewTab) {
          e.preventDefault();
          const href = (e.target as HTMLElement)?.getAttribute("href");
          if (href) {
              launch(href);
          }
      }
  }
});
};


frame.onload = () => {
  // Not really needed, since z index but ehhhh
  loading.classList.add("hidden");
  interceptLinks(frame.contentWindow! as Window & typeof globalThis);
};

function pagecheck(url: string) {
  const page = url.split("://")[1];
  const pages = ["home"];
  if (pages.includes(page)) {
    if (page === "home") {
      window.location.href = "/";
    } else {
      window.location.href = page;
    }
  } else {
    window.location.href = "404";
  }
}

window.history.replaceState?.('', '', window.location.href);
