if (navigator.userAgent.includes('Firefox')) {
  Object.defineProperty(globalThis, 'crossOriginIsolated', {
    value: true,
    writable: false,
  });
}

importScripts(
  '/assets/packaged/v/bundle.js',
  '/assets/packaged/v/config.js',
  '/assets/packaged/v/sw.js',
  '/assets/packaged/scram/wasm.js',
  '/assets/packaged/scram/shared.js',
  '/assets/packaged/scram/worker.js'
);

const uv = new UVServiceWorker();
const scramjet = new ScramjetServiceWorker();

let playgroundData;

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

self.addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event));
});

self.addEventListener('message', ({ data }) => {
  if (data.type === 'playgroundData') {
    playgroundData = data;
  }
});

scramjet.addEventListener('request', (e) => {
  if (playgroundData && e.url.href.startsWith(playgroundData.origin)) {
    const headers = {};
    const origin = playgroundData.origin;

    if (e.url.href === origin + '/') {
      headers['content-type'] = 'text/html';
      e.response = new Response(playgroundData.html, { headers });
    } else if (e.url.href === origin + '/style.css') {
      headers['content-type'] = 'text/css';
      e.response = new Response(playgroundData.css, { headers });
    } else if (e.url.href === origin + '/script.js') {
      headers['content-type'] = 'application/javascript';
      e.response = new Response(playgroundData.js, { headers });
    } else {
      e.response = new Response('empty response', { headers });
    }

    e.response.rawHeaders = headers;
    e.response.rawResponse = {
      body: e.response.body,
      headers: headers,
      status: e.response.status,
      statusText: e.response.statusText,
    };
    e.response.finalURL = e.url.toString();
  }
});
