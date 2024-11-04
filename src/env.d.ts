/// <reference path="../.astro/types.d.ts" />
declare const config: Window.Config;

interface Window {
  __uv$location?: any;
  LAST_UPDATED: string;
  VERSION: string;
}

declare namespace Window {
  interface Config {
    prefix: string;
    encodeUrl: (str: string) => string | null;
    decodeUrl: (str: string) => string | null;
    handler: string;
    client: string;
    bundle: string;
    config: string;
    sw: string;
  }
}

declare module "@mercuryworkshop/epoxy-transport";
declare module "@mercuryworkshop/wisp-js/server";
declare module "@mercuryworkshop/bare-mux/node";
