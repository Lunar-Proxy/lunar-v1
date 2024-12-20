import { isJsxFragment } from "typescript";

interface Window {
  eruda: any;
}

const bak = document.getElementById('back');
const fwd = document.getElementById('forward');
const refresh = document.getElementById('reload');
const starting = document.getElementById('starting') as HTMLDivElement;
const frame = document.getElementById('frame') as HTMLIFrameElement;
const setting = document.getElementById('set') as HTMLDivElement;
const app = document.getElementById('app') as HTMLDivElement;
const gam = document.getElementById('game') as HTMLDivElement;
const home = document.getElementById('home') as HTMLDivElement;
const ff = document.getElementById('full-screen') as HTMLDivElement;
const cnsl = document.getElementById('console') as HTMLDivElement;
const star = document.getElementById('fav') as HTMLDivElement;

if (cnsl) {

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
          const favorites = JSON.parse(localStorage.getItem('@lunar/favorites') || '[]');
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

