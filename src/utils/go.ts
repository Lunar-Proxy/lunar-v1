import { BareMuxConnection } from "@mercuryworkshop/bare-mux";

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
let setup = {
  wisp: localStorage.getItem("@lunar/settings/wisp") || (location.protocol === "https:" ? "wss" : "ws") + "://" + location.host + "/goo/",
  transport: localStorage.getItem("@lunar/settings/transport") || "lc", 
  ptype: localStorage.getItem("@lunar/settings/ptype") || "uv"
}

async function frame() { 
const connection = new BareMuxConnection("/bm/worker.js");
    if (setup.transport === "ep") {
  console.debug("Using epoxy transport");
  await connection.setTransport("/ep/index.mjs", [{ wisp: setup.wisp }]);
} else {
  console.debug("Using libcurl transport");
  await connection.setTransport("/lb/index.mjs", [{ wisp: setup.wisp }]);
}

if (setup.ptype == "uv") {
  uv()
} else if (setup.ptype == "sj") {
  sj()
}
  }

  // Proxy Types setup 
  function uv() {
 console.debug("Using UV")

  }

  function sj() {
    console.debug("Using ScramJet (Beta)")
  }

  // Nav Bar setup
 iframe.onload = function() {
  setInterval(() => {
    if (iframe) {
      const url = iframe.contentWindow?.__uv$location?.href;
      if (url && url !== previousUrl) {
        const charLimit = limit();
        bar.value =
          url.length > charLimit ? url.substring(0, charLimit) + "..." : url;
        previousUrl = url;
      }

      const image = `${iframe.contentWindow!.__uv$location?.origin}/favicon.ico`;
      favicon.src = image;
      favicon.onerror = () => {
        favicon.src = "/src/globe.png";
      };
      title.textContent = iframe.contentWindow?.document.title || "";
    } else {
      throw new Error("iframe not found");
    }
  }, 1000);


if (bar) {
  bar.onkeydown = (e) => {
    if (e.key === "Enter") {
      let Inputurl = bar.value;
      localStorage.setItem("@lunar/gourl", Inputurl);
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
    } 
  )}


if (b) {
   b.addEventListener("click", () => {
      iframe.contentWindow?.history.back();
    } 
  )};


if (r) {
  r.addEventListener("click", () => {
     iframe.contentWindow?.location.reload();
   } 
  );
}
 }

function limit() {
  const vw = Math.max(
    document.documentElement.clientWidth || 0,
    window.innerWidth || 0,
  );
  const charWidth = 8;
  return Math.floor(vw / charWidth);
}

frame();
