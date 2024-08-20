# Stage 1: Build
FROM oven/bun:latest AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and bun.lockb (if exists)
COPY package.json bun.lockb* ./

# Install dependencies
RUN bun install --frozen-lockfile --production

# Copy the rest of the application code
COPY . .

# Run Prisma migrations and generate Prisma Client
RUN bun run prisma migrate deploy
RUN bun run prisma generate

# Stage 2: Runtime
FROM oven/bun:latest

# Set the working directory
WORKDIR /app

# Copy built files and node_modules from the builder stage
COPY --from=builder /app /app

# Copy Prisma schema
COPY --from=builder /app/prisma /app/prisma

# Copy .env file
COPY .env .env

# Expose port for the application
EXPOSE 3000

# Start the application
CMD ["bun", "run", "start"]
