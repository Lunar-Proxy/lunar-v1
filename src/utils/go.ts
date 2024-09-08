document.title =
  localStorage.getItem("@lunar/cloak/title") || "Home - Google Drive";
let link: HTMLLinkElement =
  (document.querySelector("link[rel='icon']") as HTMLLinkElement) ||
  document.createElement("link");
link.rel = "icon";
link.href =
  localStorage.getItem("@lunar/cloak/favicon") || "./assets/favicon/drive.svg";
document.head.appendChild(link);
const iframe: HTMLElement = document.createElement("iframe");
