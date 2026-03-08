FROM node:22.19-alpine AS builder

WORKDIR /app

# Copy package.json first
COPY package*.json ./

# Install ALL dependencies (devDependencies included!)
RUN npm ci --frozen-lockfile

# Copy rest of the frontend files
COPY . .

# Build arguments
ARG VITE_API_URL=http://localhost:8080
ARG VITE_USE_MOCK=false
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_USE_MOCK=$VITE_USE_MOCK

# Build frontend
RUN npm run build

# Stage 2: Nginx
FROM nginx:alpine AS production
COPY --from=builder /app/dist /usr/share/nginx/html

RUN printf 'server {\n  listen 80;\n  root /usr/share/nginx/html;\n  index index.html;\n  location / {\n    try_files $uri $uri/ /index.html;\n  }\n}\n' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]