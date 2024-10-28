/// <reference path="../.astro/types.d.ts" />

const LAST_UPDATED: string;
const VERSION: string;

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

let connection: BareMuxConnection | null;

declare const config: Config;
declare module "@mercuryworkshop/epoxy-transport";
declare module "@mercuryworkshop/wisp-js/server";
declare module "@mercuryworkshop/bare-mux/node";
declare module "@mercuryworkshop/libcurl-transport";
