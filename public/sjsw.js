importScripts(
  '/assets/sj/wasm.js',
  '/assets/sj/shared.js',
  '/assets/sj/worker.js'
);

const scramjet = new ScramjetServiceWorker();

async function handleRequest(event) {
  await scramjet.loadConfig();
  return scramjet.route(event) ? scramjet.fetch(event) : fetch(event.request);
}

self.addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event));
});

let playgroundData;

self.addEventListener('message', ({ data: { type, ...restData } }) => {
  if (type === 'playgroundData') {
    playgroundData = restData;
  }
});
