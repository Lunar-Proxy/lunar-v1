/// <reference path="../.astro/types.d.ts" />

const LAST_UPDATED: string;
const VERSION: string;
const __uv$location: Location;

interface Config {
  prefix: string;
  encodeUrl: (str: string) => string | null;
  decodeUrl: (str: string) => string | null;
}

declare const config: Config;
declare const ScramjetController: any;
interface Window {
  sj: any;
  __uv$location?: {
    href: string;
    origin: string;
  };
}

declare module "@mercuryworkshop/epoxy-transport";
declare module "@mercuryworkshop/wisp-js/server";
declare module "@mercuryworkshop/bare-mux/node";
declare module "@mercuryworkshop/libcurl-transport";
