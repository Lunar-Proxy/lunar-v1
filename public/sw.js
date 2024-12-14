importScripts('/assets/v/bundle.js', '/assets/v/config.js', '/assets/v/sw.js');

const uv = new UVServiceWorker();

async function handleRequest(event) {
  return uv.route(event) ? uv.fetch(event) : fetch(event.request);
}

self.addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event));
});
