importScripts("./assets/u/bundle.js");
importScripts("./assets/u/config.js");
importScripts(config.sw || "./assets/u/sw.js");
const uv = new UVServiceWorker();
self.addEventListener("fetch", function (event) {
  if (event.request.url.startsWith(location.origin + config)) {
    event.respondWith(
      (async function () {
        return await uv.fetch(event);
      })(),
    );
  } else {
    event.respondWith(
      (async function () {
        return await fetch(event.request);
      })(),
    );
  }
});
