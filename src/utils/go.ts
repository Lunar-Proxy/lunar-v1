document.title =
  localStorage.getItem("@lunar/cloak/title") || "Home - Google Drive";
let link: HTMLLinkElement =
  (document.querySelector("link[rel='icon']") as HTMLLinkElement) ||
  document.createElement("link");
link.rel = "icon";
link.href =
  localStorage.getItem("@lunar/cloak/favicon") || "./assets/favicon/drive.svg";
document.head.appendChild(link);
const iframe = document.createElement("iframe") as HTMLIFrameElement;
const gourl = localStorage.getItem("@lunar/gourl") as string;
iframe.style.height = "100vh";
iframe.style.width = "100vw";
iframe.src = gourl;

iframe.addEventListener("load", LFinish);

function LFinish() {
  const loading = document.getElementById("loading")!;
  loading.style.display = "none";
}
