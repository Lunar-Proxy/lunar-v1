if (navigator.userAgent.includes('Firefox')) {
  Object.defineProperty(globalThis, 'crossOriginIsolated', {
    value: true,
    writable: false,
  });
}
importScripts(
     '/packaged/v/bundle.js',
    '/packaged/v/config.js',
    '/packaged/v/sw.js',
    '/packaged/scram/wasm.js',
    '/packaged/scram/shared.js',
    '/packaged/scram/worker.js'
);

const uv = new UVServiceWorker();
const scramjet = new ScramjetServiceWorker();

let playgroundData;

self.addEventListener("message", ({ data }) => {
    if (data.type === "playgroundData") {
        playgroundData = data;
    }
});

async function handleRequest(event) {
    if (uv.route(event)) {
        return await uv.fetch(event);
    }

    await scramjet.loadConfig();
    if (scramjet.route(event)) {
        return await scramjet.fetch(event);
    }
    return await fetch(event.request);
}

self.addEventListener("fetch", (event) => {
    event.respondWith(handleRequest(event));
});
