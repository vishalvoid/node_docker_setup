FROM node:lts-alpine

WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./
RUN yarn install

COPY prisma/schema.prisma ./prisma/
RUN npx prisma generate

COPY . .
RUN yarn build
EXPOSE 8080

# Make entrypoint script executable
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

ENTRYPOINT ["docker-entrypoint.sh"]
CMD [ "yarn", "dev" ]