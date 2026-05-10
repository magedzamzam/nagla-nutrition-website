# ============================================================
# Stage 1: Build the React frontend
# ============================================================
FROM node:20-alpine AS frontend-builder
WORKDIR /build

# Copy package files first for better caching
COPY frontend/package.json frontend/package-lock.json* ./

# Install ALL deps (including devDependencies needed for build)
RUN npm install --include=dev

# Copy source
COPY frontend/ ./

# Build (Vite will transform index.html and emit /dist with hashed assets)
RUN npm run build

# Verify the build actually transformed index.html
# (if /src/main.jsx is still in dist/index.html, the build silently failed)
RUN if grep -q '/src/main.jsx' dist/index.html; then \
      echo "ERROR: Vite did not transform index.html. Build is broken." && exit 1; \
    fi && \
    echo "Frontend built successfully" && \
    ls -la dist/ && \
    grep -E 'script|link.*assets' dist/index.html | head -5

# ============================================================
# Stage 2: Install backend deps
# ============================================================
FROM node:20-alpine AS backend-builder
WORKDIR /build
RUN apk add --no-cache python3 make g++
COPY backend/package.json backend/package-lock.json* ./
RUN npm install --omit=dev

# ============================================================
# Stage 3: Final runtime image
# ============================================================
FROM node:20-alpine

RUN apk add --no-cache nginx supervisor curl

# Backend
WORKDIR /app
COPY --from=backend-builder /build/node_modules ./node_modules
COPY backend/ ./
RUN mkdir -p /app/uploads /app/uploads/thumbs /app/data && \
    chmod -R 755 /app/uploads /app/data

# Frontend (static build)
COPY --from=frontend-builder /build/dist /usr/share/nginx/html

# Verify the final image has the transformed index.html
RUN if grep -q '/src/main.jsx' /usr/share/nginx/html/index.html; then \
      echo "ERROR: Final image has untransformed index.html" && exit 1; \
    fi

# Nginx config
COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY nginx/supervisord.conf /etc/supervisord.conf

# Nginx needs these dirs
RUN mkdir -p /run/nginx /var/log/nginx /var/lib/nginx/tmp/client_body

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD curl -fsS http://localhost/healthz || exit 1

CMD ["supervisord", "-c", "/etc/supervisord.conf", "-n"]
