import { Settings } from '@src/utils/config';
export async function Search(query: string) {
  const engine = await Settings.get('engine')
  if (validateUrl(query)) {
    if (!query.startsWith('https://') && !query.startsWith('http://')) {
      return `https://${query}`;
    }
    return query;
  }
  return engine + encodeURIComponent(query);
}

function validateUrl(url: string): boolean {
  const urlPattern = /^(https?:\/\/)?[^\s.]+\.[^\s]+$/;
  return urlPattern.test(url);
}