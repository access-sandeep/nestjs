## ---------- Base ----------
FROM node:20-alpine AS base
WORKDIR /app

## ---------- Dependencies ----------
FROM base AS dependencies
COPY package.json package-lock.json ./
RUN npm ci

## ---------- Build ----------
FROM base AS build
COPY package.json package-lock.json ./
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
RUN npm run build \
    && npm ci --omit=dev

## ---------- Production ----------
FROM node:20-alpine AS production
ENV NODE_ENV=production
WORKDIR /app

RUN addgroup -S nodejs && adduser -S nestjs -G nodejs

COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json

USER nestjs

EXPOSE 3000

CMD ["node", "dist/main"]
