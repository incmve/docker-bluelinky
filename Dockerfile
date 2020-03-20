FROM node:latest
WORKDIR /app
COPY package.json /app
COPY server.js /app

RUN npm install

EXPOSE 8080

CMD [ "node", "server.js" ]
