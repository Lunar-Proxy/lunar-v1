FROM node:20
ENV NODE_ENV=production
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm i -g pnpm && pnpm install --no-cache && pnpm run build
COPY . .
EXPOSE 8080
CMD ["pnpm", "start"]
