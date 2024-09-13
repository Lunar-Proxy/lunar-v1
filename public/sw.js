importScripts("./assets/u/bundle.js");
importScripts("./assets/u/config.js");
importScripts(config.sw || "./assets/u/sw.js");
const u = new UVServiceWorker();
async function handleRequest(event) {
  if (u.route(event)) {
    return await u.fetch(event);
  }

  return await fetch(event.request);
}

self.addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event));
});
