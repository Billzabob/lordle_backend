FROM node:18-alpine

# update packages
RUN apk update

# create root application folder
WORKDIR /app

ENV PORT="7777"

# copy configs to /app folder
COPY package*.json ./
COPY tsconfig.json ./

RUN npm install
RUN npm install pm2 -g

# copy source code to /app/src folder
COPY src /app/src

# check files list
RUN ls -a
RUN npm run build

EXPOSE 7777

CMD [ "pm2-runtime", "./dist/main.js" ]