# ─── Stage 1: Build Vite client ───────────────────────────────────────────────
FROM node:20-alpine AS client-builder

WORKDIR /app

# Copy workspace manifests trước để cache layer npm install
COPY package.json package-lock.json ./
COPY client/package.json ./client/
COPY server/package.json ./server/

RUN npm ci

# Copy source và build
COPY client/ ./client/
RUN npm run build --workspace client


# ─── Stage 2: Production server ───────────────────────────────────────────────
FROM node:20-alpine AS production

WORKDIR /app

# Chỉ cài deps của server (không cần devDeps)
COPY package.json package-lock.json ./
COPY server/package.json ./server/
RUN npm ci --workspace server --omit=dev

# Copy server source
COPY server/ ./server/

# Copy React build từ stage 1
COPY --from=client-builder /app/client/dist ./client/dist

ENV NODE_ENV=production
ENV PORT=4000

EXPOSE 4000

CMD ["node", "server/src/index.js"]
