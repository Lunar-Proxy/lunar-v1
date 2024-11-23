importScripts(
  "/assets/sj/wasm.js",
  "/assets/sj/shared.js",
  "/assets/sj/worker.js",
  "/assets/v/bundle.js",
  "/assets/v/config.js",
  "/assets/v/sw.js",
);

const sj = new ScramjetServiceWorker();
const fonts = new UVServiceWorker();

let playgroundData;

self.addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event));
});

self.addEventListener("message", ({ data }) => {
  if (data.type === "playgroundData") {
    playgroundData = data;
  }
});

async function handleRequest(event) {
  if (sj.route(event)) {
    await sj.loadConfig();
    return sj.fetch(event);
  }

  if (fonts.route(event)) {
    return fonts.fetch(event);
  }

  return fetch(event.request);
}
