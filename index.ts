import Fastify from "fastify";
import fastifyMiddie from "@fastify/middie";
import fastifyStatic from "@fastify/static";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { exec } from "child_process";
import { promisify } from "node:util";
import chalk from "chalk";

const execPromise = promisify(exec);
const port = "8080" as string;
const app = Fastify({ logger: false });

if (!fs.existsSync("dist")) {
  try {
    console.log(chalk.blue.bold("Dist not found, building..."));
    await execPromise("npm run build");
    console.log(chalk.green.bold("Dist successfully built!"));
  } catch (e) {
    console.log(chalk.red.bold("Unable to build dist folder", e));
    process.exit(1);
  }
}

await app.register(fastifyMiddie);

let ssrHandler;
if (fs.existsSync("./dist/server/entry.mjs")) {
  try {
    const module = await import("./dist/server/entry.mjs");
    ssrHandler = module.handler;
    app.use(ssrHandler);
    console.log(chalk.green.bold("Successfully registered SSR handler."));
  } catch (e) {
    console.error(chalk.yellow.bold("Failed to import SSR handler:", e));
  }
} else {
  console.log(chalk.red.bold("SSR handler not found."));
  process.exit(1);
}

await app.register(fastifyStatic, {
  root: fileURLToPath(new URL("./dist/client", import.meta.url)),
});

app.listen(port, (err, address) => {
  if (err) {
    console.log(chalk.blue.bold("The following error happend", err));
  } else {
    console.log(chalk.blue.bold("Lunar is running on:"));
    console.log(chalk.blue.bold(`http://localhost:${port}`));
    console.log(chalk.blue.bold(`${address}`));
  }
});
