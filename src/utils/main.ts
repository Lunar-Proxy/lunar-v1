import { Settings } from '@src/utils/config';
import { BareMuxConnection } from '@mercuryworkshop/bare-mux';

const input = document.getElementById('input') as HTMLInputElement;
const fm = document.getElementById('form') as HTMLFormElement;
const frame = document.getElementById('frame') as HTMLIFrameElement;
const loading = document.getElementById('load') as HTMLDivElement;
const welcome = document.getElementById('starting') as HTMLDivElement;
let url: string;
function validate(url: string): boolean {
  const rgex = /^(https?:\/\/)?([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})(\/[^\s]*)?$/;
  return rgex.test(url);
}

async function launch(link: string) {
  try {
  await navigator.serviceWorker.register('./sw.js');
  console.debug('Service Worker registered');
  } catch (error) {
  throw new Error('Service Worker registration failed');
  }
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
  frame.addEventListener('load', () => {
    console.debug('Loaded Iframe successfully');
    const links = frame.contentWindow?.document.querySelectorAll<HTMLAnchorElement>('a');
    if (links) {
      links.forEach((element) => {
        element.addEventListener('click', (event) => {
          const target = event.target as HTMLAnchorElement | null;
          if (target?.target === '_top') {
            if (target.href == null) {
             console.log("link was null, not attempting.")
            
            } else {
            event.preventDefault()
            console.debug('Redirected URL:', target.href);
            launch(target.href);
          }
        }
        });
      });
    }
  });
}
fm.addEventListener('submit', async (event) => {
  event.preventDefault();
  welcome.classList.add('hidden');
  loading.classList.remove('hidden');
  let value = input.value;
  const engine = await Settings.get('search-engine');
  if (validate(value)) {
    if (!/^https?:\/\//i.test(value)) {
      value = 'https://' + value;
    }
  } else {
    value = engine + value;
  }
  launch(value);
});

window.history.replaceState?.('', '', window.location.href);
