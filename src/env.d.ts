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

interface Game {
  title: string;
  logo: string;
  alert: string;
  category: string;
  website: string;
}

declare const config: Config;
