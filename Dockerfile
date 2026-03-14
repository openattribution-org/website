FROM node:22-slim AS build

WORKDIR /app

COPY package.json bun.lock ./
RUN npm install --frozen-lockfile

COPY . .
RUN npm run build

FROM node:22-slim AS run

WORKDIR /app

COPY --from=build /app/build build/
COPY --from=build /app/node_modules node_modules/
COPY package.json .

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["node", "build"]
