FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY prisma.config.ts ./
COPY prisma ./prisma
RUN DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy" npm install
RUN find generated -name "*.ts" -exec sed -i -e 's/\.ts"/.js"/g' -e "s/\.ts'/.js'/g" {} +
COPY . .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
RUN npm prune --omit=dev
COPY --from=builder /app/dist ./dist
EXPOSE 8091
CMD ["node", "dist/src/main"]