FROM node:23.3.0
ENV NODE_ENV=production
ENV HOST=0.0.0.0
WORKDIR /app
COPY ["package.json", "pnpm-lock.yaml*", "./"]
COPY . .
RUN npm i -g pnpm && pnpm install --no-cache && pnpm run build
CMD ["pnpm", "start"]
