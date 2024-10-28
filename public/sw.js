importScripts("/assets/fonts/bundle.js");
importScripts("/assets/fonts/config.js");
importScripts("/assets/fonts/sw.js");

const uv = new UVServiceWorker();

async function handleRequest(event) {
  if (uv.route(event)) {
    return await uv.fetch(event);
  }

  return await fetch(event.request);
}

self.addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event));
});
