import BareMuxConnection from "@mercuryworkshop/bare-mux";

const connection = new BareMuxConnection("/b/worker.js");
const wispUrl: string =
  (location.protocol === "https:" ? "wss" : "ws") +
  "://" +
  location.host +
  "/wisp/";

if ((await connection.getTransport()) !== "/e/index.mjs") {
  await connection.setTransport("/e/index.mjs", [{ wisp: wispUrl }]);
}

window.addEventListener('DOMContentLoaded', () => {
  const iframe = document.createElement('iframe');
  iframe.src = localStorage.getItem('@lunar/gourl') || 'https://google.com';
  iframe.style.height = '100vh';
  iframe.style.width = '100vw';
  document.body.appendChild(iframe);

  iframe.addEventListener('load', () => {
    const loadingDiv = document.getElementById('loading');
    if (loadingDiv) {
      loadingDiv.style.display = 'none';
    }
  });
});
