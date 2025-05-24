import { Settings } from '@src/utils/config';
import { Cloak } from './cloak';

const menuItems = document.querySelectorAll<HTMLLIElement>('#menu li');
const sections = document.querySelectorAll<HTMLDivElement>('.content-section');
const adconfirm = document.getElementById('adconfirm') as HTMLButtonElement;
const Confirm = document.getElementById('confirm') as HTMLButtonElement;
const conStatus = document.getElementById('lcstatus') as HTMLSpanElement;
const abStatus = document.getElementById('abstatus') as HTMLSpanElement;
const Ab = document.getElementById('ab') as HTMLButtonElement;
const openCloak = document.getElementById('openCloak') as HTMLButtonElement;
const adStatus = document.getElementById('adstatus') as HTMLSpanElement;

type SettingType = 'backend' | 'engine' | 'PreventClosing' | 'cloak' | 'ads';

const settingMapping: Record<string, Record<string, string>> = {
  ptype: {
    uv: 'Ultraviolet (Default)',
    sj: 'Scramjet',
    default: 'Ultraviolet (Default)',
  },
  engine: {
    'https://www.google.com/search?q=': 'Google',
    'https://duckduckgo.com/?q=': 'DuckDuckGo (Default)',
    default: 'DuckDuckGo (Default)',
  },
};

function switchSection(event: MouseEvent) {
  const target = event.currentTarget as HTMLLIElement;
  const sectionId = target.getAttribute('data-section');
  if (!sectionId) return;

  menuItems.forEach(item => item.classList.remove('bg-gray-700'));
  sections.forEach(section => section.classList.add('hidden'));

  target.classList.add('bg-gray-700');

  const activeSection = document.getElementById(sectionId);
  if (activeSection) activeSection.classList.remove('hidden');
}

menuItems.forEach(item => item.addEventListener('click', switchSection));

document.addEventListener('DOMContentLoaded', () => {
  const dropdownButtons = document.querySelectorAll<HTMLElement>('[id$="button"]');

  dropdownButtons.forEach(async (button) => {
    const text = button.querySelector('span');
    const dropdownId = button.id.replace('button', '');
    const dropdown = document.getElementById(dropdownId) as HTMLElement | null;

    if (!dropdown) {
      console.error(`[ERROR] Dropdown not found for button: ${button.id}`);
      return;
    }

    let currentSetting = '';
    if (dropdown.id === 'ptype') {
      const backend = await Settings.get('backend');
      currentSetting = settingMapping.ptype[backend] ?? settingMapping.ptype.default;
    } else if (dropdown.id === 'engine') {
      const engine = await Settings.get('engine');
      currentSetting = settingMapping.engine[engine] ?? settingMapping.engine.default;
    }

    if (text) {
      text.textContent = currentSetting;
    }

    button.addEventListener('click', (event: MouseEvent) => {
      event.stopPropagation();
      document.querySelectorAll<HTMLElement>('.dropdown').forEach(el => {
        if (el !== dropdown) el.classList.add('hidden');
      });
      dropdown.classList.toggle('hidden');
      console.log('[DEBUG] Dropdown toggled');
    });

    const options = dropdown.querySelectorAll<HTMLButtonElement>('button');
    options.forEach(option => {
      option.addEventListener('click', async () => {
        const selected = option.textContent ?? '';
        console.log('[DEBUG] Selected option:', selected);

        if (dropdown.id === 'ptype') {
          await Settings.edit('backend', option.id);
        } else if (dropdown.id === 'engine') {
          await Settings.edit('engine', option.id);
        }

        if (text) text.textContent = selected;
        dropdown.classList.add('hidden');
      });
    });
  });

  document.addEventListener('click', (event: MouseEvent) => {
    dropdownButtons.forEach(button => {
      const dropdownId = button.id.replace('button', '');
      const dropdown = document.getElementById(dropdownId);
      if (dropdown && !dropdown.classList.contains('hidden')) {
        const isInside = button.contains(event.target as Node) || dropdown.contains(event.target as Node);
        if (!isInside) {
          dropdown.classList.add('hidden');
        }
      }
    });
  });
});

Confirm.addEventListener('click', async () => {
  const current = await Settings.get('PreventClosing');
  await Settings.edit('PreventClosing', !current);
  console.log('[DEBUG] toggled to', !current);
  conStatus.textContent = `Currently: ${current ? 'Off' : 'On'}`;
  top?.location.reload();
});

Ab.addEventListener('click', async () => {
  const current = await Settings.get('cloak');
  await Settings.edit('cloak', !current);
  console.log('[DEBUG] toggled to', !current);
  abStatus.textContent = `Currently: ${current ? 'Off' : 'On'}`;
  if (!top) location.reload();
});

adconfirm.addEventListener('click', async () => {
  const current = await Settings.get('ads');
  await Settings.edit('ads', !current);
  console.log('[DEBUG] toggled to', !current);
  adStatus.textContent = `Currently: ${current ? 'Off' : 'On'}`;
  if (!top) location.reload();
});

document.addEventListener('DOMContentLoaded', async () => {
  const ad = await Settings.get('ads');
  const confirm = await Settings.get('PreventClosing');
  const cloak = await Settings.get('cloak');
  adStatus.textContent = `Currently: ${ad ? 'On' : 'Off'}`;
  conStatus.textContent = `Currently: ${confirm ? 'On' : 'Off'}`;
  abStatus.textContent = `Currently: ${cloak ? 'Off' : 'On'}`;
});

openCloak.addEventListener('click', () => {
  Cloak();
});
