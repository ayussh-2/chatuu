FROM node:18-alpine

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .

EXPOSE 5000

ENV NODE_ENV=production

CMD ["yarn", "start"]
