FROM node:20
ENV NODE_ENV=production
WORKDIR /app
COPY package.json pnpm-lock.yaml astro.config.mjs ./
RUN npm install -g pnpm && pnpm install
COPY . .
RUN pnpm build
EXPOSE 8080
CMD ["pnpm", "start"]
