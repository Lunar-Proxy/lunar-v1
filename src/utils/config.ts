import localforage from 'localforage';

const store = localforage.createInstance({
  name: 'Lunar',
  storeName: 'Settings',
});

interface Setting {
  [key: string]: any;
}

const defaultSettings: Setting = {
  cloak: false,
  backend: 'uv',
  engine: 'https://duckduckgo.com/?q=',
  transport: 'ep',
  PreventClosing: false,
  ads: true,
  plugins: {
    adblock:
      "<script>(function(){const s=['#sidebar-wrap','#advert','#xrail','#middle-article-advert-container','#sponsored-recommendations','#taboola-content','#inarticle_wrapper_div','#rc-row-container','#ads','.ad','.advertisement','.ad-banner','.ad-slot','script','iframe','video','aside','amp-ad','ins.adsbygoogle'],r=()=>s.forEach(e=>document.querySelectorAll(e).forEach(n=>n.remove())),k=()=>document.querySelectorAll('body *').forEach(n=>['fixed','sticky'].includes(getComputedStyle(n).position)&&n.remove()),o=()=>{if(document.body)new MutationObserver(()=>{r(),k()}).observe(document.body,{subtree:true,childList:true})};document.readyState==='loading'?document.addEventListener('DOMContentLoaded',()=>{r(),k(),o()}):(r(),k(),o());})();</script>",
  },
};

const Settings = (() => {
  async function ensureDefaults(): Promise<void> {
    for (const key of Object.keys(defaultSettings)) {
      const existing = await store.getItem(key);
      if (existing === null || existing === undefined) {
        await store.setItem(key, defaultSettings[key]);
      }
    }
  }

  async function add(settingName: string, value: any): Promise<void> {
    await store.setItem(settingName, value);
  }

  async function edit(settingName: string, value: any): Promise<void> {
    const existing = await store.getItem(settingName);
    if (existing !== null && existing !== undefined) {
      await store.setItem(settingName, value);
    } else {
      console.warn(`[Settings] Setting "${settingName}" does not exist.`);
    }
  }

  async function get(settingName: string): Promise<any> {
    return store.getItem(settingName);
  }

  ensureDefaults();

  return { add, get, edit };
})();

export { Settings };
