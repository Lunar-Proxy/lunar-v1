import { BareMuxConnection } from '@mercuryworkshop/bare-mux';
import { Settings } from '@src/utils/config';

const exit = document.getElementById('return') as HTMLButtonElement;
const refresh = document.getElementById('rotate') as HTMLButtonElement;
const frame = document.getElementById('display') as HTMLIFrameElement;
const full = document.getElementById('maximize') as HTMLButtonElement;
const launch = document.getElementById('game-frame') as HTMLDivElement;
let url: string;

export async function launch2(link: string) {
  await navigator.serviceWorker.register('./sw.js');
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
  scram.init('./sjsw.js');
  const connection = new BareMuxConnection('/bm/worker.js');
  const wispurl =
    (location.protocol === 'https:' ? 'wss' : 'ws') +
    '://' +
    location.host +
    '/w/';
  const transport = await Settings.get('transport');
  const backend = await Settings.get('backend');
  if (transport == 'ep') {
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

  if (backend == '/p/') {
    url = backend + UltraConfig.encodeUrl(link);
    console.debug('Using UV to unblock');
  } else {
    url = scram.encodeUrl(link);
    console.debug('Using Scramjet to unblock');
  }
  frame.src = url;
  launch.classList.remove('hidden');
  frame.addEventListener('load', () => {
    console.debug('Loaded Iframe successfully');
    const links =
      frame.contentWindow?.document.querySelectorAll<HTMLAnchorElement>('a');
    if (links) {
      links.forEach((element) => {
        element.addEventListener('click', (event) => {
          const target = event.target as HTMLAnchorElement | null;

          if (target?.target === '_top') {
            event.preventDefault();
            console.debug('New URL:', target.href);
            launch2(target.href);
          }
        });
      });
    }
  });
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
