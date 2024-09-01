# Stage 1: Build
FROM oven/bun:latest AS builder

WORKDIR /app

COPY package.json ./

RUN bun install --frozen-lockfile

COPY . .

# Stage 2: Runtime
FROM oven/bun:latest

WORKDIR /app

COPY --from=builder /app /app

RUN bun install
RUN bun run prisma generate

EXPOSE 3000

# Start the application
CMD ["bun", "start"]
