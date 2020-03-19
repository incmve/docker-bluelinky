FROM node:latest
WORKDIR /app
COPY package.json /app
COPY server.js /app

COPY config.json.example /app/config.json

# COPY config.json /app

RUN npm install

EXPOSE 8080
CMD [ "node", "server.js" ]
