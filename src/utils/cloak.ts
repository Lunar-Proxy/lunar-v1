import { Settings } from "../utils/config";

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
        const doc = popup.document;
        const iframe = doc.createElement("iframe");
        const style = iframe.style;
        
        iframe.src = location.href;
        style.position = "fixed";
        style.top = style.bottom = style.left = style.right = "0";
        style.border = style.outline = "none";
        style.width = style.height = "100%";

        doc.body.appendChild(iframe);
        window.location.replace("https://google.com");
        // Todo: Make name & location random
      } catch (error) {
       throw new Error("Cloaking failed with error:" + error);
      }
    }
  }
}
