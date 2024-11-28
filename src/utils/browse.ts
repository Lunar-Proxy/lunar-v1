const bak = document.getElementById("back");
const fwd = document.getElementById("forward");
const refresh = document.getElementById("reload");
const frame = document.getElementById("frame") as HTMLIFrameElement;
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
