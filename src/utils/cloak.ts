async function cloak(): Promise<void> {
  try {
    const response: Response = await fetch("./assets/json/tbs.json");
    if (!response.ok) return;

    const data = await response.json();
    if (window.name === "tbclk") return;

    const win = window.open("", "tbclk");
    const randomItem =
      data.items[Math.floor(Math.random() * data.items.length)];

    if (!win || win.closed) {
      alert(
        "Consider allowing popups to use about:blank so this site doesnt show up in your history.",
      );

      const link =
        (document.querySelector("link[rel='icon']") as HTMLLinkElement) ||
        (document.createElement("link") as HTMLLinkElement);
      link.rel = "icon";
      link.href =
        localStorage.getItem("@lunar/custom/favicon") || randomItem.favicon;
      document.head.appendChild(link);
      document.title =
        localStorage.getItem("@lunar/custom/title") || randomItem.title;
      localStorage.setItem("@lunar/cloak/title", document.title);
      localStorage.setItem("@lunar/cloak/favicon", link.href);
    }

    if (win) {
      const bodyStyles = {
        margin: "0",
        padding: "0",
        height: "100vh",
        width: "100vw",
      };
      Object.assign(win.document.body.style, bodyStyles);
      win.document.documentElement.style.height = "100%";

      let iframe =
        (win.document.querySelector("iframe") as HTMLIFrameElement) ||
        (win.document.createElement("iframe") as HTMLIFrameElement);
      if (!iframe.src) {
        const iStyles = {
          border: "none",
          width: "100vw",
          height: "100vh",
        };
        Object.assign(iframe.style, iStyles);
        iframe.src = location.href;
        win.document.body.appendChild(iframe);

        const link =
          (win.document.querySelector("link[rel='icon']") as HTMLLinkElement) ||
          (win.document.createElement("link") as HTMLLinkElement);
        link.rel = "icon";
        link.href = randomItem.favicon;
        win.document.head.appendChild(link);
        win.document.title = randomItem.title;
        location.replace(randomItem.redir);
      }
    }
  } catch {}
}

function checkCloak(): boolean {
  return !localStorage.getItem("@lunar/cloak/ab") ||
  localStorage.getItem("@lunar/cloak/ab") === "on" ? true : false;
}

if (checkCloak()) {
  cloak();
} else {
  console.debug("Cloaking is disabled, you can turn it back on in settings.");
  document.title = localStorage.getItem("@lunar/custom/title") || "Lunar";
  const link =
    (window.document.querySelector("link[rel='icon']") as HTMLLinkElement) ||
    (window.document.createElement("link") as HTMLLinkElement);
  link.rel = localStorage.getItem("@lunar/custom/favicon") || "icon";
  link.href = "./favicon.ico";
  localStorage.setItem("@lunar/cloak/title", document.title);
  localStorage.setItem("@lunar/cloak/favicon", link.href);
  window.document.head.appendChild(link);
}
