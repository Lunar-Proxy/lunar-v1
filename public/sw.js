importScripts("/assets/u/bundle.js", "/assets/u/config.js", "/assets/u/sw.js");

const u = new UVServiceWorker();

self.addEventListener("fetch", (event) => {
  event.respondWith(
    (async () => {
      if (u.route(event)) {
        return u.fetch(event);
      }
      return fetch(event.request);
    })(),
  );
});
