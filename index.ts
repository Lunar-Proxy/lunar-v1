import Fastify from 'fastify';
import fastifyMiddie from '@fastify/middie';
import fastifyStatic from '@fastify/static';
import fastifyCompress from '@fastify/compress';
import basicAuth from '@fastify/basic-auth';
import fs from 'node:fs';
import { execSync } from 'child_process';
import chalk from 'chalk';
import { createServer } from 'http';
import { Socket } from 'net';
import { server as wisp } from '@mercuryworkshop/wisp-js/server';
import configuration from './config';
import path from 'path';

const port: number = configuration.server.port || 8080;

async function build() {
  if (!fs.existsSync('dist')) {
    console.log(
      chalk.yellow.bold('🚧 Lunar is not built. Building Lunar now...')
    );
    try {
      execSync('pnpm build', { stdio: 'inherit' });
      console.log(
        chalk.green.bold('✅ Building Lunar was completed successfully!')
      );
    } catch (error) {
      throw new Error(
        `Build Error: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  } else {
    console.log(
      chalk.blue.bold('📂 Lunar was already built. Skipping build process.')
    );
  }
}

const app = Fastify({
  logger: false,
  serverFactory: (handler) =>
    createServer(handler).on('upgrade', (req, socket: Socket, head) => {
      if (req.url?.startsWith('/w')) {
        wisp.routeRequest(req, socket, head);
      }
    }),
});

await app.register(fastifyCompress, { encodings: ['deflate', 'gzip', 'br'] });

if (configuration.protect.challenge) {
  console.log(chalk.magenta.bold('🔒 Password Protection is enabled.'));
  await app.register(basicAuth, {
    authenticate: true,
    validate(username, password, _req, _reply, done) {
      if (configuration.protect.users[username] === password) {
        if (configuration.protect.logging) {
          console.log(chalk.green(`✅ User "${username}" authenticated.`));
        }
        return done();
      }
      return done(new Error('Invalid credentials'));
    },
  });
  app.addHook('onRequest', app.basicAuth);
}

app.setErrorHandler((error, _request, reply) => {
  if (error.statusCode === 401) {
    reply.status(401).header('Content-Type', 'text/html').send(`
         <!doctype html>
<html>
  <head>
    <title>Welcome to nginx!</title>
    <style>
      html {
        color-scheme: light dark;
      }
      body {
        width: 35em;
        margin: 0 auto;
        font-family: Tahoma, Verdana, Arial, sans-serif;
      }
    </style>
  </head>
  <body>
    <h1>Welcome to nginx!</h1>
    <p>
      If you see this page, the nginx web server is successfully installed and
      working. Further configuration is required. If you are expecting another
      page, please check your network or
      <a id="rcheck" onclick="location.reload();"><b>Refresh this page</b></a>
    </p>

    <p>
      For online documentation and support please refer to
      <a href="http://nginx.org/">nginx.org</a>.<br />
      Commercial support is available at
      <a href="http://nginx.com/">nginx.com</a>.
    </p>

    <p><em>Thank you for using nginx.</em></p>
  </body>
</html>
      `);
  } else {
    reply.send(error);
  }
});
await build();

// @ts-ignore might be false if they havent built the project
const { handler } = await import('./dist/server/entry.mjs');
app.register(fastifyStatic, {
  root: path.join(import.meta.dirname, 'dist', 'client'),
});
await app.register(fastifyMiddie);
app.use(handler);

app.listen({ port }, (err) => {
  const { address, port } = app.server.address() as { address: string; port: number };
  console.log(chalk.green.bold(`🌙 Lunar is running at:`));
  console.log(chalk.blue.bold(`🌐 Local: http://localhost:${port}`));
  console.log(chalk.blue.bold(`🌍 Network: http://${address}:${port}`));

  if (err) {
    throw new Error(`❌ Failed to start Lunar: ${err.message}`);
  } 

});
