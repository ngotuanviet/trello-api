FROM node:20

WORKDIR /app

# 1. Kích hoạt Yarn 4 qua Corepack trước
RUN corepack enable && corepack prepare yarn@4.5.0 --activate

# 2. Chỉ copy các file cấu hình bắt buộc (dấu * giúp bỏ qua nếu không có file)
COPY package.json yarn.lock .yarnrc.yml* ./

# 3. Cài đặt dependencies
RUN yarn install

# 4. Copy toàn bộ source code và build
COPY . .

RUN yarn build

EXPOSE 8017

CMD ["yarn", "production"]