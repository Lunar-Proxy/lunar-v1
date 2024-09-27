const titl =
  localStorage.getItem("@lunar/cloak/title") || "Home - Google Drive";
const favi =
  localStorage.getItem("@lunar/cloak/favicon") || "./assets/favicon/drive.svg";

document.title = titl;

let link: HTMLLinkElement =
  (document.querySelector("link[rel='icon']") as HTMLLinkElement) ||
  document.createElement("link");
link.rel = isApple ? "apple-touch-icon" : "icon";
link.href = favi;
document.head.appendChild(link);
