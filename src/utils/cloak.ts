import { Settings } from "@src/utils/config";

const cloak = [
  {
    name: "Google Drive",
    url: "https://drive.google.com",
    favicon:
      "https://ssl.gstatic.com/docs/doclist/images/infinite_arrow_favicon_5.ico",
  },
  {
    name: "Google",
    url: "https://www.google.com",
    favicon: "https://www.google.com/favicon.ico",
  },
  {
    name: "Google Docs",
    url: "https://docs.google.com",
    favicon: "https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico",
  },
];

if (await Settings.get("cloak")) {
  Cloak();
} else {
  console.debug("Cloaking is off. Enable in settings.");
}

async function Cloak() {
  let inFrame;

  try {
    inFrame = window !== top;
  } catch {
    inFrame = true;
  }

  if (!inFrame && !navigator.userAgent.includes("Firefox")) {
    const popup = window.open("about:blank");

    if (!popup || popup.closed) {
      alert("Allow popups/redirects to avoid the website going to history.");
    } else {
      try {
        const item = cloak[Math.floor(Math.random() * cloak.length)];
        const doc = popup.document;
        const iframe = doc.createElement("iframe");
        const style = iframe.style;
        const link =
          (document.querySelector("link[rel='icon']") as HTMLLinkElement) ||
          (document.createElement("link") as HTMLLinkElement);
        doc.title = item.name;
        link.rel = "icon";
        link.href = item.favicon;
        iframe.src = location.href;
        style.position = "fixed";
        style.top = style.bottom = style.left = style.right = "0";
        style.border = style.outline = "none";
        style.width = style.height = "100%";
        doc.body.appendChild(iframe);
        doc.head.appendChild(link);
        window.location.replace(item.url);
      } catch (error) {
        throw new Error("Cloaking failed with error:" + error);
      }
    }
  }
}
