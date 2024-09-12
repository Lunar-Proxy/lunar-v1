
importScripts('./assets/u/bundle.js');
importScripts('./assets/u/config.js');
importScripts(config.sw || './assets/u/sw.js');
const uv = new UVServiceWorker();
async function handleRequest(event) {
    if (uv.route(event)) {
        return await uv.fetch(event);
    }
    
    return await fetch(event.request)
}

self.addEventListener('fetch', (event) => {
    event.respondWith(handleRequest(event));
});