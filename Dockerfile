FROM node:20
ENV NODE_ENV=production
WORKDIR /app
COPY . .
RUN npm install && npm run build
EXPOSE 8080
CMD ["npm", "start"]
