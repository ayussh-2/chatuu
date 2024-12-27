FROM node:18-alpine

WORKDIR /app

RUN apk add --no-cache openssl

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .

EXPOSE 5000

# Use development environment
ENV NODE_ENV=development

CMD ["yarn", "dev"]
