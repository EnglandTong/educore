FROM node:20-alpine AS build
WORKDIR /app
ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
RUN corepack enable

COPY package.json pnpm-workspace.yaml turbo.json tsconfig.json .npmrc ./
COPY apps/web/package.json apps/web/package.json
COPY packages/types/package.json packages/types/package.json
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm --filter @educore/types build \
  && pnpm --filter @educore/web build

# ---------- Nginx ----------
FROM nginx:alpine AS runtime

# SPA routing: all paths → index.html
COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf

# Built assets
COPY --from=build /app/apps/web/dist /usr/share/nginx/html

# Gzip pre-compressed assets (vite produces .gz files)
# Enable gzip_static in nginx.conf to serve these directly

HEALTHCHECK --interval=15s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:80/ || exit 1

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
