import { BareMuxConnection } from "@mercuryworkshop/bare-mux";


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
const form = document.getElementById("fm") as HTMLFormElement;
const frame = document.getElementById("frame") as HTMLIFrameElement;
const loading = document.getElementById("loading") as HTMLDivElement;
const welcome = document.getElementById("starting") as HTMLDivElement;

form.addEventListener("submit", (event) => {
  let value = input.value;
  if (value.startsWith("lunar://")) {
    event.preventDefault();
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
    value = "https://www.google.com/search?q=" + value;
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

frame.onload = () => {
  // Not really needed, since z index but ehhhh
  loading.classList.add("hidden");
  const scriptContent = `
(function () {
  const originalWindowOpen = window.open;
  window.open = function (url, target, features) {
    if (typeof url === 'string' || url instanceof URL) {
      return location.href = url;
    }
    return null;
  };
})();`;
  if (frame.contentDocument) {
    const scriptElement = frame.contentDocument.createElement("script");
    scriptElement.textContent = scriptContent;
    frame.contentDocument.body.appendChild(scriptElement);
  }
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