interface Message {
  type: string;
  text: string;
}

interface Data {
  messages: Message[];
}

import { Settings } from '@src/utils/config';

interface CloakDetails {
  name: string;
  url: string;
  favicon: string;
}

let cloak: CloakDetails[] = [];

if (await Settings.get('PreventClosing')) {
  window.addEventListener('beforeunload', function (event) {
    event.preventDefault();
    return (event.returnValue = '');
  });
}

async function fetchData(): Promise<void> {
  try {
    const response = await fetch('/assets/json/tab.json');
    if (!response.ok) {
      throw new Error(`HTTP error, status: ${response.status}`);
    }
    cloak = await response.json();
    if (!Array.isArray(cloak)) {
      throw new Error('Invalid JSON structure: Expected an array');
    }
  } catch (error) {
    throw new Error(`Error reading JSON file: ${error}`);
  }
}

async function Cloak(): Promise<void> {
  let inFrame: boolean;

  try {
    inFrame = window !== top;
  } catch {
    inFrame = true;
  }

  if (!inFrame && !navigator.userAgent.includes('Firefox')) {
    const popup = window.open('about:blank');

    if (!popup || popup.closed) {
      alert('Allow popups/redirects to avoid the website showing in history.');
      return;
    }

    try {
      const item = cloak[Math.floor(Math.random() * cloak.length)];
      const doc = popup.document;
      const iframe = doc.createElement('iframe');
      Object.assign(iframe.style, {
        position: 'fixed',
        top: '0',
        bottom: '0',
        left: '0',
        right: '0',
        border: 'none',
        outline: 'none',
        width: '100%',
        height: '100%',
      });
      const link =
        (document.querySelector("link[rel='icon']") as HTMLLinkElement) ||
        document.createElement('link');
      link.rel = 'icon';
      link.href = item.favicon;
      doc.head.appendChild(link);
      doc.title = item.name;
      doc.body.appendChild(iframe);
      iframe.src = location.href;
      window.location.replace(item.url);
    } catch (error) {
      alert(`Error: ${error}`);
    }
  }
}

(async function initialize() {
  try {
    await fetchData();
    const status = await Settings.get('cloak');
    if (status === 'on') {
      await Cloak();
    } else {
      console.debug('Cloaking is off. Enable cloaking in settings.');
    }
  } catch (error) {
    throw new Error(`Initialization failed: ${error}`);
  }
})();

fetch('/assets/json/quotes.json')
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then((data: Data) => {
    const messages = data.messages;
    if (!messages || messages.length === 0) {
      throw new Error('No messages found in JSON.');
    }
    const random = Math.floor(Math.random() * messages.length);
    const message = messages[random];
    const quote = document.getElementById('quote') as HTMLDivElement;
    if (quote && message && message.text) {
      quote.innerHTML = message.text;
    }
  })
  .catch((error) => {
    throw new Error(`error: ${error}`);
  });

try {
  const trackingId = 'G-DQZPCVEF89';
  const gt1 = document.createElement('script');
  gt1.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`;
  gt1.async = true;
  document.head.appendChild(gt1);
  const gt2 = document.createElement('script');
  gt2.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${trackingId}');
    `;
  document.head.appendChild(gt2);
} catch (e) {
  console.error(`Error loading Google Analytics: ${e}`);
  throw new Error(`Error loading Google Analytics: ${e}`);
}

console.debug('Google Analytics loaded.');
