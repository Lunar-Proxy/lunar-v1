FROM node:20

RUN apt-get update && \
    apt-get install -y git

RUN git clone https://github.com/Lunar-proxy/Lunar/

WORKDIR /Lunar

RUN npm install && npm run build

EXPOSE 8080

CMD ["npm", "start"]
