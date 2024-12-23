import { Settings } from '@src/utils/config';

const bak = document.getElementById('back') as HTMLButtonElement;
const fwd = document.getElementById('forward') as HTMLButtonElement;
const refresh = document.getElementById('reload') as HTMLButtonElement;
const starting = document.getElementById('starting') as HTMLDivElement;
const frame = document.getElementById('frame') as HTMLIFrameElement;
// it isnt ready | const setting = document.getElementById('set') as HTMLDivElement;
const app = document.getElementById('app') as HTMLDivElement;
const gam = document.getElementById('game') as HTMLDivElement;
const home = document.getElementById('home') as HTMLDivElement;
const ff = document.getElementById('full-screen') as HTMLDivElement;
const cnsl = document.getElementById('console') as HTMLDivElement;
const star = document.getElementById('fav') as HTMLDivElement;
const copy = document.getElementById('link') as HTMLButtonElement;
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

if (copy) {
  copy.addEventListener('click', async () => {
    const FrameUrl = new URL(frame.src);
    const pathname = FrameUrl.pathname;
    
    try {
      if (!frame || !frame.src || frame.src === 'about:blank') {
        console.log('Cannot copy URL without a valid source.');
        return;
      }
     
      if (!pathname.startsWith('/p/') && !pathname.startsWith('/scram/')) {
          await navigator.clipboard.writeText(frame.src);
          alert('URL copied to clipboard!');
          return;
      }
      
      const backend = await Settings.get('backend');
      let url;

      if (backend === 'uv') {
        url = UltraConfig.decodeUrl(frame.src.split('/p/')[1] || frame.src);
      } else {
        url = scram.decodeUrl(frame.src.split('/scram/')[1] || frame.src);
      }

      url = url || frame.src;

      await navigator.clipboard.writeText(url);
      alert('URL copied to clipboard!');
    } catch (error) {
      console.error('Error copying URL:', error);
    }
  });
}

if (cnsl) {
  cnsl.addEventListener('click', () => {
    const eruda = frame.contentWindow?.eruda;

    if (eruda) {
      if (eruda._isInit) {
        eruda.destroy();
        console.debug('Eruda console destroyed.');
        return;
      } else {
        console.debug('Eruda console is not initialized.');
      }
    } else {
      console.debug('Eruda console not loaded yet.');
    }

    if (!eruda || !eruda._isInit) {
      if (frame.contentDocument) {
        var script = frame.contentDocument.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/eruda';
        script.onload = function () {
          frame.contentWindow?.eruda.init();
          frame.contentWindow?.eruda.show();
          console.debug('Eruda console initialized.');
        };
        frame.contentDocument.head.appendChild(script);
      } else {
        console.error('Cannot inject script, frame content document is null.');
      }
    }
  });
}

if (ff) {
  ff.addEventListener('click', () => {
    if (frame && frame.src) {
      frame.requestFullscreen();
    } else {
      console.log('Cannot go fullscreen without a valid source.');
    }
  });
}

if (home) {
  home.addEventListener('click', () => {
    frame.src = './';
  });
}

if (app) {
  app.addEventListener('click', () => {
    starting.classList.add('hidden');
    frame.src = './ap';
  });
}

if (gam) {
  gam.addEventListener('click', () => {
    starting.classList.add('hidden');
    frame.src = './gm';
  });
}

if (bak) {
  bak.addEventListener('click', () => {
    frame.contentWindow!.history.forward();
  });
}

if (fwd) {
  fwd.addEventListener('click', () => {
    frame.contentWindow!.history.back();
  });
}

if (refresh) {
  refresh.addEventListener('click', () => {
    frame.contentWindow!.location.reload();
  });
}

if (star) {
  star.addEventListener('click', () => {
    if (frame && frame.src) {
      const nickname = prompt('Enter a nickname for this favorite:');
      if (nickname) {
        const favorites = JSON.parse(
          localStorage.getItem('@lunar/favorites') || '[]'
        );
        const newFav = { nickname, url: frame.src };
        favorites.push(newFav);
        localStorage.setItem('@lunar/favorites', JSON.stringify(favorites));
        console.log(`Favorite "${nickname}" added successfully!`);
      } else {
        alert('Favorite not saved. Nickname is required.');
      }
    } else {
      console.debug('Cannot favorite an invalid page');
    }
  });
}
