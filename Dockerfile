FROM node:20

WORKDIR /app

COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn ./.yarn

RUN corepack enable
RUN corepack prepare yarn@4.5.0 --activate

RUN yarn install --immutable

COPY . .

RUN yarn build

EXPOSE 8017

CMD ["yarn", "production"]
