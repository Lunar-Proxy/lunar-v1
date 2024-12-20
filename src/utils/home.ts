interface Message {
  type: string;
  text: string;
}

interface Data {
  messages: Message[];
}

import { Settings } from '@src/utils/config';
let cloak: any;

async function fetchData(): Promise<void> {
  try {
    const response = await fetch('/assets/json/tab.json');
    if (!response.ok) {
      throw new Error(`HTTP error, status: ${response.status}`);
    }
    cloak = await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('Error reading JSON file: ' + error.message);
    } else {
      throw new Error('Error reading JSON file');
    }
  }
}

async function Cloak() {
  let inFrame;

  try {
    inFrame = window !== top;
  } catch {
    inFrame = true;
  }

  if (!inFrame && !navigator.userAgent.includes('Firefox')) {
    const popup = window.open('about:blank');

    if (!popup || popup.closed) {
      alert('Allow popups/redirects to avoid the website going into history.');
    } else {
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
          (document.createElement('link') as HTMLLinkElement);
        link.rel = 'icon';
        link.href = item.favicon;
        doc.title = item.name;
        doc.body.appendChild(iframe);
        doc.head.appendChild(link);
        iframe.src = location.href;
        window.location.replace(item.url);
      } catch (error) {
        if (error instanceof Error) {
          throw new Error('Cloaking failed with error: ' + error.message);
        } else {
          throw new Error('Cloaking failed with an unknown error');
        }
      }
    }
  }
}

(async () => {
  try {
    await fetchData();
    const status = await Settings.get('cloak');
    if (status === 'on') {
   //   Cloak();
    } else {
      console.debug('Cloaking is off. Enable in settings.');
    }
  } catch (error) {
    console.error('Initialization failed:', error);
  }
})();


fetch("/assets/json/quotes.json")
.then((response) => {
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
})
.then((data: Data) => {
  const messages = data.messages;
  if (!messages || messages.length === 0) {
    throw new Error("No messages found in JSON.");
  }
  const random = Math.floor(Math.random() * messages.length);
  const message = messages[random];
  const quote = document.getElementById('quote') as HTMLDivElement;
  if (quote && message && message.text) {
    quote.textContent = message.text;
  }
})
.catch((error) => {
  console.error("Error:", error);
});
