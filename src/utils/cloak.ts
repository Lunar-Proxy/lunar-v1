async function getData(): Promise<any | null> {
  try {
    const response = await fetch("./assets/json/tbs.json");
    if (!response.ok) {
      console.error("File not found");
      return null;
    }
    const jsonData = await response.json();
    return jsonData;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

async function cloak(): Promise<void> {
  try {
    const data = await getData();
    if (data) {
      openWindow(data);
    }
  } catch (error) {
    console.error("Error in cloaking", error);
  }

  function openWindow(data: any): void {
    const windowName = "tbclk";
    if (window.name !== windowName) {
      const win = window.open("", windowName);

      if (!win || win.closed) {
        alert("Consider allowing popups to use about:blank");

        const randomItem =
          data.items[Math.floor(Math.random() * data.items.length)];

        let link: HTMLLinkElement =
          (document.querySelector("link[rel='icon']") as HTMLLinkElement) ||
          document.createElement("link");
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
        win.document.body.style.margin = "0";
        win.document.body.style.padding = "0";
        win.document.body.style.height = "100vh";
        win.document.body.style.width = "100vw";
        win.document.documentElement.style.height = "100%";

        let iframe: HTMLIFrameElement | null =
          win.document.querySelector("iframe");
        if (!iframe) {
          iframe = win.document.createElement("iframe");
          iframe.style.border = "none";
          iframe.style.width = "100vw";
          iframe.style.height = "100vh";
          iframe.style.margin = "0";
          iframe.style.padding = "0";
          iframe.src = location.href;
          win.document.body.appendChild(iframe);

          const randomItem =
            data.items[Math.floor(Math.random() * data.items.length)];

          let link: HTMLLinkElement =
            (win.document.querySelector(
              "link[rel='icon']",
            ) as HTMLLinkElement) || win.document.createElement("link");
          link.rel = "icon";
          link.href = randomItem.favicon;
          win.document.head.appendChild(link);
          win.document.title = randomItem.title;

          location.replace(randomItem.redir);
        }
      } else {
        console.error("Failed to open the new window.");
      }
    }
  }
}

if (
  localStorage.getItem("@lunar/cloak/ab") === null ||
  localStorage.getItem("@lunar/cloak/ab") === "on"
) {
  cloak();
} else {
  console.info(
    "AB Cloaking is disabled, you can turn it on by going into settings & enabling it.",
  );
}
