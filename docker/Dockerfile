FROM node:20-alpine AS base
WORKDIR /app
ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
RUN corepack enable

# ---------- Dependencies ----------
FROM base AS deps
COPY package.json pnpm-workspace.yaml turbo.json tsconfig.json .npmrc ./
COPY apps/api/package.json apps/api/package.json
COPY packages/types/package.json packages/types/package.json
COPY packages/constants/package.json packages/constants/package.json
COPY packages/algorithms/package.json packages/algorithms/package.json
COPY packages/validation/package.json packages/validation/package.json
RUN pnpm install --frozen-lockfile

# ---------- Build ----------
FROM deps AS build
COPY . .
RUN pnpm --filter @educore/types build \
  && pnpm --filter @educore/constants build \
  && pnpm --filter @educore/algorithms build \
  && pnpm --filter @educore/api build

# ---------- Production Runtime ----------
FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=4000
ENV HOST=0.0.0.0

# Copy only production node_modules (pruned)
COPY --from=build /app/node_modules ./node_modules

# Copy built packages
COPY --from=build /app/apps/api/dist ./apps/api/dist
COPY --from=build /app/apps/api/package.json ./apps/api/package.json
COPY --from=build /app/packages/types/dist ./packages/types/dist
COPY --from=build /app/packages/types/package.json ./packages/types/package.json
COPY --from=build /app/packages/constants/dist ./packages/constants/dist
COPY --from=build /app/packages/constants/package.json ./packages/constants/package.json
COPY --from=build /app/packages/algorithms/dist ./packages/algorithms/dist
COPY --from=build /app/packages/algorithms/package.json ./packages/algorithms/package.json

# Copy module seeds (for moduleLoader to read at startup)
COPY --from=build /app/modules ./modules

HEALTHCHECK --interval=15s --timeout=5s --start-period=30s --retries=3 \
  CMD wget -qO- http://localhost:4000/health || exit 1

EXPOSE 4000
CMD ["node", "apps/api/dist/server.js"]
