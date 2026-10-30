FROM node:20

WORKDIR /app

# Copy dependency definitions
COPY package.json yarn.lock ./

# Install dependencies using Yarn 1 (frozen lockfile to ensure stability)
RUN yarn install --frozen-lockfile

# Copy source code and build
COPY . .

RUN yarn build

EXPOSE 8017

CMD ["yarn", "production"]
