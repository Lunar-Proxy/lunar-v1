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
const port = process.env.PORT || "8080";  // You can change this to a port of your choosing
const app = Fastify({ logger: false });


(async () => {
  if (!fs.existsSync("dist")) {
    console.log(chalk.blue.bold("Dist not found, building..."));
    try {
      await execPromise("npm run build");
      console.log(chalk.green.bold("Dist successfully built!"));
    } catch (e) {
      console.error(chalk.red.bold("Failed to build dist folder", e));
      process.exit(1);
    }
  }


  await app.register(fastifyMiddie);

  const ssrfle = "./dist/server/entry.mjs";
  if (fs.existsSync(ssrfle)) {
    try {
      const { handler: ssrHandler } = await import(ssrfle);
      app.use(ssrHandler);
      console.log(chalk.green.bold("Successfully registered handler."));
    } catch (e) {
      console.error(chalk.yellow.bold("Failed to import handler:", e));
    }
  } else {
    console.error(chalk.red.bold("handler not found."));
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
    console.log(chalk.blue.bold('http://localhost:${port}'));
    console.log(chalk.blue.bold(${address}));
  }
});
