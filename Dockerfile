FROM node:24.11.1-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

FROM node:24.11.1-alpine AS final

WORKDIR /app

COPY --from=build /app/node_modules /app/node_modules

COPY --chown=node:node . .

RUN mkdir -p uploads logs && chown node:node uploads logs

EXPOSE 8080

USER node

CMD ["npm", "start"]

