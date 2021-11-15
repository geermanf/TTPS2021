FROM node:12-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install -g @angular/cli @angular-devkit/build-angular && npm install

EXPOSE 4200

CMD ["npm", "start"]