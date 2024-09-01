# Stage 1: Build
FROM oven/bun:latest AS builder

# Set the working directory
WORKDIR /app

# Copy package.json (if exists)
COPY package.json ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Stage 2: Runtime
FROM oven/bun:latest

# Set the working directory
WORKDIR /app

# Copy built files and node_modules from the builder stage
COPY --from=builder /app /app

# Copy .env file
COPY .env .env

# Run Prisma generate
RUN bun run prisma generate

# Expose port for the application
EXPOSE 3000

# Start the application
CMD ["bun", "start"]
