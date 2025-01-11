export async function search(input: string, backend: string, template: string) {
  const scram = new ScramjetController({
    prefix: '/scram/',
    files: {
      wasm: '/assets/packaged/scram/wasm.js',
      worker: '/assets/packaged/scram/worker.js',
      client: '/assets/packaged/scram/client.js',
      shared: '/assets/packaged/scram/shared.js',
      sync: '/assets/packaged/scram/sync.js',
    },
    defaultFlags: { serviceworkers: true },
  });
  window.sj = scram;

  let finalUrl = '';
  if (!input.includes('.')) {
    finalUrl = template.replace('%s', encodeURIComponent(input));
  } else {
    try {
      finalUrl = new URL(input).toString();
    } catch {
      try {
        const url = new URL(`https://${input}`);
        if (url.hostname.includes('.')) finalUrl = url.toString();
      } catch {
        finalUrl = template.replace('%s', encodeURIComponent(input));
      }
    }
  }

  if (backend === 'uv') return `/p/${UltraConfig.encodeUrl(finalUrl)}`;
  if (backend === 'sj') return scram.encodeUrl(finalUrl);
}
