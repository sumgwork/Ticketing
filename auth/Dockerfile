FROM node:alpine

WORKDIR /app
COPY package.json .
RUN npm install --only=prod
#only prod saves us from downloading dev dependencies
COPY . .

CMD ["npm", "start"]