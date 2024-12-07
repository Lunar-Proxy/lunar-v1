const bak = document.getElementById("back");
const fwd = document.getElementById("forward");
const refresh = document.getElementById("reload");
const starting = document.getElementById("starting") as HTMLDivElement;
const frame = document.getElementById("frame") as HTMLIFrameElement;
const setting = document.getElementById("set") as HTMLDivElement;
const app = document.getElementById("app") as HTMLDivElement
const gam = document.getElementById("game") as HTMLDivElement
const home = document.getElementById("home") as HTMLDivElement

if (home) {
 home.addEventListener("click", () => {
   frame.src = "./"
 })
}

if (app) {
  app.addEventListener("click", () => {
   starting.classList.add("hidden");
    frame.src = "./ap";
  });
}

if (gam) {
  gam.addEventListener("click", () => {
    starting.classList.add("hidden");
    frame.src = "./gm";
  });
}

if (bak) {
  bak.addEventListener("click", () => {
    frame.contentWindow!.history.forward();
  });
}

if (fwd) {
  fwd.addEventListener("click", () => {
    frame.contentWindow!.history.back();
  });
}

if (refresh) {
  refresh.addEventListener("click", () => {
    frame.contentWindow!.location.reload();
  });
}


