# Stage 1: Builder
FROM node:24-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Runner (Standalone)
FROM node:24-alpine AS runner
WORKDIR /app
# Copy built files
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
# Add user/group if needed for permissions
RUN addgroup --system --gid 1001 nextjs && \
    adduser --system --uid 1001 nextjs
COPY --from=builder --chown=nextjs:nextjs /app/public ./public
USER nextjs

# Use an entrypoint script to wait for API if needed
COPY entrypoint.sh .
RUN chmod +x entrypoint.sh

# CMD ["./entrypoint.sh"] # Or "node server.js" if no wait script needed
CMD ["node", "server.js"]