importScripts(
  "/assets/v/bundle.js",
  "/assets/v/config.js",
  "/assets/v/sw.js",
  "/assets/sj/wasm.js",
  "/assets/sj/shared.js",
  "/assets/sj/worker.js"
);

const fonts = new UVServiceWorker();
const scram = new ScramjetServiceWorker();
let playgroundData;

async function handleRequest(event) {
  if (fonts.route(event)) {
    return fonts.fetch(event);
  }
  if (scram.route(event)) {
    await scram.loadConfig();
    return scram.fetch(event);
  }
  return fetch(event.request);
}

self.addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event));
});

self.addEventListener("message", ({ data }) => {
  if (data.type === "playgroundData") {
    playgroundData = data;
  }
});
