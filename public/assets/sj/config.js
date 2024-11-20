const scram = new ScramjetController({
  prefix: "/sj/",
  files: {
    wasm: "/assets/s/wasm.js",
    worker: "/assets/s/worker.js",
    client: "/assets/s/client.js",
    shared: "/assets/s/shared.js",
    sync: "/assets/s/sync.js",
  },
});

window.sj = scram;
scram.init("./sjsw.js");
