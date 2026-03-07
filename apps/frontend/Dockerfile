# =============================================================
# Stage 1: BUILD
# Install dependencies and build the React app
# =============================================================
FROM node:22-alpine AS build

WORKDIR /app

# Copy package files first (better layer caching)
# If package.json hasn't changed, npm ci is skipped on rebuild
COPY package*.json ./

# Install all dependencies
RUN npm ci

# Copy the rest of the source code
COPY . .

# Build argument for API URL — passed from docker-compose
ARG VITE_API_URL=http://localhost:8080
ENV VITE_API_URL=$VITE_API_URL

# Build the React app → output goes to /app/dist
RUN npm run build

# =============================================================
# Stage 2: RUNTIME
# Serve the built files using Nginx (lightweight web server)
# =============================================================
FROM nginx:alpine AS runtime

# Remove default Nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy our custom Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built React files from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
