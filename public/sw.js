importScripts("/assets/v/bundle.js");
importScripts("/assets/v/config.js");
importScripts("/assets/v/sw.js");

const o = new UVServiceWorker();

async function handleRequest(event) {
  if (o.route(event)) {
    return await o.fetch(event);
  }

  return await fetch(event.request);
}

self.addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event));
});
