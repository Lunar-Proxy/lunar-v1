if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("./sw.js", { scope: "/us/" })
    .then(({ scope }) =>
      console.log("Service Worker registered with scope:", scope),
    )
    .catch((error) =>
      console.error("Service Worker registration failed:", error),
    );
  }

const titl =
  localStorage.getItem("@lunar/settings/title") || "Home - Google Drive";
const favi =
  localStorage.getItem("@lunar/settings/favicon") ||
  "./assets/favicon/drive.svg";

document.title = titl;

let link: HTMLLinkElement =
  (document.querySelector("link[rel='icon']") as HTMLLinkElement) ||
  document.createElement("link");
link.rel = "icon";
link.href = favi;
document.head.appendChild(link);
