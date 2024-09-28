importScripts("/assets/u/bundle.js", "/assets/u/config.js", "/assets/u/sw.js");

const uv = new UVServiceWorker();

self.addEventListener("fetch", (event) => {
  event.respondWith(
    (async () => {
      if (uv.route(event)) {
        return uv.fetch(event);
      }
      return fetch(event.request);
    })(),
  );
});
