import { Settings } from '@src/utils/config';
import { BareMuxConnection } from '@mercuryworkshop/bare-mux';
import { Search } from './search';

const input = document.getElementById('input') as HTMLInputElement;
const si = document.getElementById('startSearch') as HTMLInputElement;
const fm = document.getElementById('form') as HTMLFormElement;
const favicon = document.getElementById('favicon') as HTMLImageElement;
const sf = document.getElementById('startForm') as HTMLFormElement;
const frame = document.getElementById('frame') as HTMLIFrameElement;
const loading = document.getElementById('load') as HTMLDivElement;
const welcome = document.getElementById('starting') as HTMLDivElement;
const scram = new ScramjetController({
  prefix: '/scram/',
  files: {
    wasm: '/assets/packaged/scram/wasm.js',
    worker: '/assets/packaged/scram/worker.js',
    client: '/assets/packaged/scram/client.js',
    shared: '/assets/packaged/scram/shared.js',
    sync: '/assets/packaged/scram/sync.js',
  },
  defaultFlags: { serviceworkers: true },
});
window.sj = scram;
scram.init();

try {
  await navigator.serviceWorker.register('/sw.js').then(() => {
    console.log('Service Workers are registered.');
  });
} catch (error) {
  throw new Error('Service Worker registration failed with error:' + error);
}

async function launch(link: string) {
  const connection = new BareMuxConnection('/assets/packaged/bm/worker.js');
  const wispurl =
    (location.protocol === 'https:' ? 'wss' : 'ws') +
    '://' +
    location.host +
    '/wsp/';
  const backend = await Settings.get('backend');
  if ((await connection.getTransport()) !== '/assets/packaged/ep/index.mjs') {
    await connection.setTransport('/assets/packaged/ep/index.mjs', [{ wisp: wispurl }]);
  }
  console.log('Transport set to Epoxy');
  let url = await Search(link) || "d";
  if (backend == 'uv') {
      frame.src = `/p/${UltraConfig.encodeUrl(url) ?? 'ERROR'}`;
  } else {
    frame.src = scram.encodeUrl(url);
  }
  frame.addEventListener('load', () => {
    if (backend === 'uv') {
      InterceptLinks();
      input.value = '';
      let url = UltraConfig.decodeUrl(
        frame.contentWindow?.location.href.split('/p/')[1] ||
          frame.contentWindow?.location.href!
      );
      favicon.src = `https://s2.googleusercontent.com/s2/favicons?sz=64&domain_url=${url}`;
    } else {
      if (input.value === 'about:blank') {
        input.value = '';
      }
      let url = scram.decodeUrl(
        frame.contentWindow?.location.href.split('/scram/')[1] ||
          frame.contentWindow?.location.href
      );
      input.value = url || '';
      favicon.src = `https://s2.googleusercontent.com/s2/favicons?sz=64&domain_url=${url}`;
    }
  });
}
fm.addEventListener('submit', async (event) => {
  event.preventDefault();
  welcome.classList.add('hidden');
  loading.classList.remove('hidden');
  let value = input.value.trim();
  launch(value);
});

sf.addEventListener('submit', async (event) => {
  event.preventDefault();
  input.value = si.value;
  fm.dispatchEvent(new Event('submit'));
});

async function InterceptLinks() {
  console.debug('Intercepting links is running...');
  const clickableElements =
    frame.contentWindow?.document.querySelectorAll<HTMLElement>(
      'a, button, [role="button"], [onclick], [data-href], span'
    );

  if (clickableElements) {
    clickableElements.forEach((element) => {
      element.addEventListener('click', (event) => {
        const target = event.currentTarget as HTMLElement;

        let href: string | null = null;

        if (target instanceof HTMLAnchorElement) {
          href = target.href;
        } else if (target.dataset.href) {
          href = target.dataset.href;
        } else if (target.hasAttribute('onclick')) {
          const onclickContent = target.getAttribute('onclick');
          const match = onclickContent?.match(
            /(?:location\.href\s*=\s*['"])([^'"]+)(['"])/
          );
          href = match?.[1] || null;
        } else if (target.closest('a')) {
          href = target.closest('a')?.href || null;
        }

        if (href) {
          event.preventDefault();
          console.debug('Redirected URL:', href);
          launch(href);
        }
      });
    });
  }
}

window.history.replaceState?.('', '', window.location.href); // This prevents the are you sure you want to reload prompt
