# syntax=docker/dockerfile:1

FROM node:25-alpine AS base

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl libc6-compat

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

COPY package.json pnpm-lock.yaml* ./
COPY prisma ./prisma
RUN pnpm install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the app
RUN pnpm run build

# Production image, copy all the files and run nest
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# In production, we typically only need prod dependencies.
COPY package.json pnpm-lock.yaml* ./
COPY prisma ./prisma
RUN pnpm install --prod --frozen-lockfile

# Generate Prisma client for production
RUN npx prisma generate

COPY --from=builder /app/dist ./dist

# Use non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

USER nestjs

EXPOSE 3000

# Start the server - run migrations first then start the app
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main.js"]
