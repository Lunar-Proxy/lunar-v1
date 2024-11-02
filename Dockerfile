FROM node:20
ENV NODE_ENV=production
WORKDIR /app
COPY . .
RUN pnpm install && pnpm run build
EXPOSE 8080
CMD ["npm", "start"]
