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

  let ValidUrl;
  const protocol = input.includes('://');

  if (protocol) {
    const url = new URL(input);
    if (url.hostname.includes('.')) {
      ValidUrl = url.toString();
    }
  } else {
    const url = new URL(`http://${input}`);
    if (url.hostname.includes('.')) {
      ValidUrl = url.toString();
    }
  }

  if (!ValidUrl) ValidUrl = template.replace('%s', encodeURIComponent(input));

  if (backend === 'uv') return `/p/${UltraConfig.encodeUrl(ValidUrl)}`;
  if (backend === 'sj') return scram.encodeUrl(ValidUrl);

  return ValidUrl;
}
