FROM node:20
ENV NODE_ENV=production
WORKDIR /app
COPY . .
RUN npm i -g pnpm && pnpm install && pnpm run build
EXPOSE 8080
CMD ["pnpm", "start"]
