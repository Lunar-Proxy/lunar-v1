importScripts(
  "./assets/fonts/bundle.js",
  "./assets/fonts/config.js",
  "./assets/fonts/sw.js",
);

const fonts = new UVServiceWorker();

self.addEventListener("fetch", (event) => {
  event.respondWith(
    fonts.route(event) ? fonts.fetch(event) : fetch(event.request),
  );
});
