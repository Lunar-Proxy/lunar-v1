import { BareMuxConnection } from '@mercuryworkshop/bare-mux';
import { Settings } from '@src/utils/config';
const exit = document.getElementById('return') as HTMLButtonElement;
const refresh = document.getElementById('rotate') as HTMLButtonElement;
const frame = document.getElementById('display') as HTMLIFrameElement;
const full = document.getElementById('maximize') as HTMLButtonElement;
const launch = document.getElementById('game-frame') as HTMLDivElement;

export async function launch2(link: string) {
  const config = await Settings.getConfig();
  await navigator.serviceWorker.register('./sw.js');
  launch.classList.remove('hidden');
  const scram = new ScramjetController({
    prefix: '/scram/',
    files: {
      wasm: '/assets/sj/wasm.js',
      worker: '/assets/sj/worker.js',
      client: '/assets/sj/client.js',
      shared: '/assets/sj/shared.js',
      sync: '/assets/sj/sync.js',
    },
  });
  window.sj = scram;
  scram.init('./sw.js');
  const connection = new BareMuxConnection('/bm/worker.js');
  const wispurl =
    (location.protocol === 'https:' ? 'wss' : 'ws') +
    '://' +
    location.host +
    '/w/';

  let url;
  if (config.transport == 'ep') {
    if ((await connection.getTransport()) !== '/ep/index.mjs') {
      await connection.setTransport('/ep/index.mjs', [{ wisp: wispurl }]);
      console.debug('Transport is set to Epoxy');
    }
  } else {
    if ((await connection.getTransport()) !== '/lb/index.mjs') {
      await connection.setTransport('/lb/index.mjs', [{ wisp: wispurl }]);
      console.debug('Transport is set to Libcurl');
    }
  }

  if (config.backend === 'sj') {
    const frame = scramjet.createFrame();
    frame.frame.name = 'scramjet';
    url = scram.encodeUrl(link);
  } else {
    url = '/p/' + UltraConfig.encodeUrl(link);
  }
  frame.src = url;
}

exit.addEventListener('click', () => {
  frame.src = 'about:blank';
  launch.classList.add('hidden');
});

refresh.addEventListener('click', () => {
  frame.contentWindow!.location.reload();
});

full.addEventListener('click', () => {
  launch.requestFullscreen();
});
