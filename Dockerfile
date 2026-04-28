# =========================
# ===== BUILD STAGE =======
# =========================
FROM node:20-alpine AS builder

WORKDIR /app

# Install deps (including devDependencies)
COPY package*.json ./
RUN npm install --legacy-peer-deps --no-audit --no-fund

# Copy source
COPY . .

# Build
RUN npm run build


# =========================
# ===== RUNTIME STAGE =====
# =========================
FROM node:20-alpine

ENV NODE_ENV=production
ENV TZ=Asia/Kolkata
ENV LOG_DIR=/var/log/app

RUN apk add --no-cache tzdata curl \
    && cp /usr/share/zoneinfo/${TZ} /etc/localtime \
    && echo ${TZ} > /etc/timezone \
    && mkdir -p ${LOG_DIR}

WORKDIR /app

# Install serve
RUN npm install -g serve

# Copy built files only
COPY --from=builder /app/dist ./dist

# Logging wrapper
RUN printf '#!/bin/sh\n\
set -e\n\
echo \"[$(date)] Server starting...\" | tee -a ${LOG_DIR}/server.log\n\
serve -s dist -l 5175 2>&1 | tee -a ${LOG_DIR}/server.log\n\
' > /start.sh \
&& chmod +x /start.sh

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD curl -f http://localhost:5175 || exit 1

EXPOSE 5175
CMD ["/start.sh"]
