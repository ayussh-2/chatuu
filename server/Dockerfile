FROM node:18-alpine

WORKDIR /app

RUN apk add --no-cache openssl

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN npx prisma generate

EXPOSE 5000

ENV NODE_ENV=development

CMD ["yarn", "dev"]