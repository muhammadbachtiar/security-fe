# Stage 1: Build the app
FROM node:22-alpine AS builder

# Set working directory
WORKDIR /app

COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Build the app
RUN npm run build

# Remove dev dependencies (optional for smaller image)
# RUN npm prune --production

# Stage 2: Run the app using a lightweight image
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy from builder
COPY --from=builder /app ./

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/next.config.mjs ./next.config.mjs

# Expose the port Next.js uses
EXPOSE 3000

# Start the app
CMD ["npm", "start"]

