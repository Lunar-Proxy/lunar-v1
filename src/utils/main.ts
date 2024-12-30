import { Settings } from '@src/utils/config';
import { BareMuxConnection } from '@mercuryworkshop/bare-mux';
import { search } from './search';

const input = document.getElementById('input') as HTMLInputElement;
const si = document.getElementById('startSearch') as HTMLInputElement;
const fm = document.getElementById('form') as HTMLFormElement;
const sf = document.getElementById('startForm') as HTMLFormElement;
const frame = document.getElementById('frame') as HTMLIFrameElement;
const loading = document.getElementById('load') as HTMLDivElement;
const welcome = document.getElementById('starting') as HTMLDivElement;

async function launch(link: string) {
  const connection = new BareMuxConnection('/bm/worker.js');
  const wispurl =
    (location.protocol === 'https:' ? 'wss' : 'ws') +
    '://' +
    location.host +
    '/wsp/';
  const backend = await Settings.get('backend');

  if ((await connection.getTransport()) !== '/ep/index.mjs') {
    await connection.setTransport('/ep/index.mjs', [{ wisp: wispurl }]);
  }
  console.log('Transport set to Epoxy');
  let url = await search(link, backend, 'https://www.google.com/search?q=%s');
  frame.src = url;
  frame.addEventListener('load', () => {
    loading.classList.add('hidden');
    if (backend == 'uv') {
      InterceptLinks();
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
