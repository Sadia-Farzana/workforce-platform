# ─────────────────────────────────────────────────────────────
# Stage 1: BUILD
# Install all deps (including devDeps) and compile TypeScript
# ─────────────────────────────────────────────────────────────
FROM node:22-alpine AS build

WORKDIR /app

# Copy package files first (better Docker layer caching)
# If package.json hasn't changed, npm ci is skipped on rebuild
COPY package*.json ./

# Install ALL dependencies including devDependencies (need tsc)
RUN npm ci

# Copy TypeScript source
COPY tsconfig.json ./
COPY src ./src

# Compile TypeScript → JavaScript into /app/dist
RUN npm run build

# ─────────────────────────────────────────────────────────────
# Stage 2: RUNTIME
# Only copy compiled JS + production dependencies
# Result is a much smaller final image
# ─────────────────────────────────────────────────────────────
FROM node:22-alpine AS runtime

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ONLY production dependencies (no typescript, ts-node, etc.)
RUN npm ci --omit=dev

# Copy compiled JavaScript from build stage
COPY --from=build /app/dist ./dist

# ─────────────────────────────────────────────────────────────
# Runtime config
# ─────────────────────────────────────────────────────────────
ENV NODE_ENV=production

# Non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Start the compiled worker
ENTRYPOINT ["node", "dist/index.js"]
