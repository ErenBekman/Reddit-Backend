FROM node:16

WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./
COPY .npmrc ./

RUN npm install
RUN rm -f .npmrc
RUN npm ci --only=production

# Bundle app source
COPY . .

ENV NODE_ENV="production"
ENV TZ="UTC"

EXPOSE 3000

CMD [ "npm", "run", "start" ]