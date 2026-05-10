# ============================================================
# Stage 1: Build the React frontend
# ============================================================
FROM node:20-alpine AS frontend-builder
WORKDIR /build
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# ============================================================
# Stage 2: Install backend deps
# ============================================================
FROM node:20-alpine AS backend-builder
WORKDIR /build
RUN apk add --no-cache python3 make g++
COPY backend/package*.json ./
RUN npm ci --omit=dev

# ============================================================
# Stage 3: Final runtime image
# Serves React via Nginx + runs Node API + supervisord
# ============================================================
FROM node:20-alpine
RUN apk add --no-cache nginx supervisor curl

# Backend
WORKDIR /app
COPY --from=backend-builder /build/node_modules ./node_modules
COPY backend/ ./
RUN mkdir -p /app/uploads /app/data && chmod 755 /app/uploads /app/data

# Frontend (static build)
COPY --from=frontend-builder /build/dist /usr/share/nginx/html

# Nginx config
COPY nginx/nginx.conf /etc/nginx/nginx.conf

# Supervisor config to run nginx + node together
COPY nginx/supervisord.conf /etc/supervisord.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -fsS http://localhost/healthz || exit 1

CMD ["supervisord", "-c", "/etc/supervisord.conf", "-n"]
