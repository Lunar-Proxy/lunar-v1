import { BareMuxConnection } from '@mercuryworkshop/bare-mux';
import { Settings } from '@src/utils/config';

const exit = document.getElementById('return') as HTMLButtonElement;
const refresh = document.getElementById('rotate') as HTMLButtonElement;
const frame = document.getElementById('display') as HTMLIFrameElement;
const full = document.getElementById('maximize') as HTMLButtonElement;
const launch = document.getElementById('game-frame') as HTMLDivElement;
let url: string;

export async function launch2(link: string) {
  const scram = new ScramjetController({
    prefix: '/scram/',
    files: {
      wasm: '/assets/sj/wasm.js',
      worker: '/assets/sj/worker.js',
      client: '/assets/sj/client.js',
      shared: '/assets/sj/shared.js',
      sync: '/assets/sj/sync.js',
    },
    defaultFlags: {
      serviceworkers: true,
    },
  });
  window.sj = scram;
  scram.init('/sjsw.js');

  const connection = new BareMuxConnection('/bm/worker.js');
  const wispurl =
    (location.protocol === 'https:' ? 'wss' : 'ws') +
    '://' +
    location.host +
    '/wsp/';
  const transport = await Settings.get('transport');
  const backend = await Settings.get('backend');
  if (transport == 'ep') {
    if ((await connection.getTransport()) !== '/ep/index.mjs') {
      await connection.setTransport('/ep/index.mjs', [{ wisp: wispurl }]);
    }
  } else {
    if ((await connection.getTransport()) !== '/lb/index.mjs') {
      await connection.setTransport('/lb/index.mjs', [{ wisp: wispurl }]);
    }
    console.debug('Using', transport, 'as transport');
  }
  try {
    await navigator.serviceWorker.register('/sw.js');
    console.debug('UV Service Worker registered');
  } catch (error) {
    throw new Error('UV Service Worker registration failed');
  }

  if (backend == 'uv') {
    url = `/p/${UltraConfig.encodeUrl(link)}`;
    console.debug('Using Ultraviolet to unblock.');
  } else if (backend == 'scramjet') {
    url = scram.encodeUrl(link);
    console.debug('Using Scramjet (BETA) to unblock.');
  }

  frame.src = url;

  frame.addEventListener('load', () => {
    0;
    InterceptLinks();
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
          launch2(href);
        }
      });
    });
  }
}
