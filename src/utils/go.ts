window.addEventListener("DOMContentLoaded", () => {
  document.title =
    localStorage.getItem("@lunar/cloak/title") || "Home - Google Drive";
  let link: HTMLLinkElement =
    (document.querySelector("link[rel='icon']") as HTMLLinkElement) ||
    document.createElement("link");
  link.rel = "icon";
  link.href =
    localStorage.getItem("@lunar/cloak/favicon") ||
    "./assets/favicon/drive.svg";
  document.head.appendChild(link);
  const iframe = document.createElement("iframe") as HTMLIFrameElement;
  iframe.src = localStorage.getItem("@lunar/gourl") || "https://google.com";
  iframe.style.height = "100vh" as string;
  iframe.style.width = "100vw";
  document.body.appendChild(iframe);

  iframe.addEventListener("load", () => {
    const loadingDiv = document.getElementById("loading");
    if (loadingDiv) {
      loadingDiv.style.display = "none";
    }
  });
});
