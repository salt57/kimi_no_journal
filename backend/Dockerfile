FROM node:16-alpine
WORKDIR /usr/app
COPY package.json yarn.lock ./
RUN yarn --ignore-scripts
COPY tsconfig.json tsconfig.json
COPY typings typings
COPY src src
RUN yarn run build
RUN rm -r src typings yarn.lock tsconfig.json
COPY .env ./ 

CMD ["yarn", "start"]