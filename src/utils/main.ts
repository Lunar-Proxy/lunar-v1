import { BareMuxConnection } from '@mercuryworkshop/bare-mux';
import { Settings } from '@src/utils/config';
import { Search } from './search';

const copyBtn = document.getElementById('link') as HTMLButtonElement;
const inputField = document.getElementById('input') as HTMLInputElement;
const mainForm = document.getElementById('form') as HTMLFormElement;
const faviconImg = document.getElementById('favicon') as HTMLImageElement;
const contentFrame = document.getElementById('frame') as HTMLIFrameElement;
const clearBtn = document.getElementById('clear') as HTMLButtonElement;
const startInput = document.getElementById('startSearch') as HTMLInputElement;
const searchBtn = document.getElementById('searchBtn') as HTMLButtonElement;
const startForm = document.getElementById('startForm') as HTMLFormElement;
const loadingDiv = document.getElementById('loading') as HTMLDivElement;
const welcomeDiv = document.getElementById('starting') as HTMLDivElement;
const startClearBtn = document.getElementById('sclear') as HTMLButtonElement;

const connection = new BareMuxConnection('/assets/packaged/bm/worker.js');
const wispUrl = `${location.protocol === 'https:' ? 'wss' : 'ws'}://${location.host}/wsp/`;

const scram = new ScramjetController({
  prefix: '/scram/',
  files: {
    wasm: '/assets/packaged/scram/wasm.wasm',
    worker: '/assets/packaged/scram/worker.js',
    client: '/assets/packaged/scram/client.js',
    shared: '/assets/packaged/scram/shared.js',
    sync: '/assets/packaged/scram/sync.js',
  },
  flags: {},
});

window.sj = scram;
scram.init();

try {
  await navigator.serviceWorker.register('/sw.js');
  console.log('[DEBUG] Service Workers are registered.');
} catch (error) {
  throw new Error('[DEBUG] Service Worker registration failed with error:' + error);
}

document.addEventListener('DOMContentLoaded', async () => {
  const currentTransport = await connection.getTransport();
  if (currentTransport !== '/assets/packaged/ep/index.mjs') {
    await connection.setTransport('/assets/packaged/ep/index.mjs', [{ wisp: wispUrl }]);
  }
});

async function launch(link: string) {
  const backend = await Settings.get('backend');
  const currentTransport = await connection.getTransport();

  if (currentTransport !== '/assets/packaged/ep/index.mjs') {
    await connection.setTransport('/assets/packaged/ep/index.mjs', [{ wisp: wispUrl }]);
  }

  console.log('[DEBUG] Transport set to Epoxy');
  const url = (await Search(link)) || 'd';

  contentFrame.src =
    backend === 'uv' ? `/p/${UltraConfig.encodeUrl(url) ?? 'ERROR'}` : scram.encodeUrl(url);

  console.log(`[DEBUG] URL set to ${contentFrame.src}`);

  contentFrame.addEventListener('load', () => {
    const frameWindow = contentFrame.contentWindow;
    const pathname = new URL(frameWindow!.location.href).pathname;

    if (!pathname.startsWith('/p/') && !pathname.startsWith('/scram/')) return;

    const isUV = backend === 'uv';
    const decodedUrl = isUV
      ? UltraConfig.decodeUrl(pathname.replace(/^\/p\//, ''))
      : scram.decodeUrl(pathname.replace(/^\/scram\//, ''));

    if (isUV) InterceptLinks();

    inputField.value = decodedUrl || '';
    faviconImg.src = `https://s2.googleusercontent.com/s2/favicons?sz=64&domain_url=${decodedUrl}`;
    copyBtn.style.right = '40px';
    clearBtn.style.right = '10px';
    clearBtn.classList.remove('hidden');
  });
}

mainForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  welcomeDiv.classList.add('hidden');
  loadingDiv.classList.remove('hidden');

  const inputVal = inputField.value.trim();

  if (inputVal.startsWith('lunar://')) {
    LunarPaths(inputVal);
  } else {
    launch(inputVal);
  }
});

searchBtn.addEventListener('click', async (event) => {
  event.preventDefault();
  mainForm.dispatchEvent(new Event('submit'));
});

startForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  inputField.value = startInput.value;
  mainForm.dispatchEvent(new Event('submit'));
});

startClearBtn?.addEventListener('click', () => {
  startInput.value = '';
  startClearBtn.classList.add('hidden');
  startInput.focus();
});

startInput?.addEventListener('input', function () {
  startClearBtn.classList.toggle('hidden', this.value.length < 1);
});

function LunarPaths(path: string) {
  let target = '';
  if (path === 'lunar://apps') {
    inputField.value = path;
    target = './ap';
  } else if (path === 'lunar://games') {
    inputField.value = path;
    target = './gm';
  } else if (path === 'lunar://settings') {
    inputField.value = path;
    target = './s';
  } else {
    throw new Error('[ERROR] Invalid Path');
  }

  contentFrame.src = target;
  copyBtn.style.right = '40px';
  clearBtn.style.right = '10px';
  clearBtn.classList.remove('hidden');
}

async function InterceptLinks() {
  console.log('[DEBUG] Intercepting links is running...');
  const clickableElements = contentFrame.contentWindow?.document.querySelectorAll<HTMLElement>(
    'a, button, [role="button"], [onclick], [data-href], span'
  );

  clickableElements?.forEach((el) => {
    el.addEventListener('click', (event) => {
      const target = event.currentTarget as HTMLElement;
      let href: string | null = null;

      if (target instanceof HTMLAnchorElement) {
        href = target.href;
      } else if (target.dataset.href) {
        href = target.dataset.href;
      } else if (target.hasAttribute('onclick')) {
        const onclickContent = target.getAttribute('onclick');
        const match = onclickContent?.match(/(?:location\.href\s*=\s*['"])([^'"]+)(['"])/);
        href = match?.[1] || null;
      } else if (target.closest('a')) {
        href = target.closest('a')?.href || null;
      }

      if (href) {
        event.preventDefault();
        console.debug('[DEBUG] Redirected URL:', href);
        launch(href);
      }
    });
  });
}

window.history.replaceState?.('', '', window.location.href);
