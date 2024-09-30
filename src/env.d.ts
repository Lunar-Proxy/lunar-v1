/// <reference path="../.astro/types.d.ts" />

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

declare const config: Config;
declare module "@mercuryworkshop/epoxy-transport";
declare module "@mercuryworkshop/wisp-js/server";
