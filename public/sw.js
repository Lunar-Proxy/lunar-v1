importScripts("./assets/fonts/bundle.js");
importScripts("./assets/fonts/config.js");
importScripts("./assets/fonts/sw.js");

const fonts = new UVServiceWorker();

async function handleRequest(event) {
  if (fonts.route(event)) {
    return await fonts.fetch(event);
  }

  return await fetch(event.request);
}

self.addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event));
});
