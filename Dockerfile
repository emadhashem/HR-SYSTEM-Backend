FROM node:21-alpine AS builder

WORKDIR /app

COPY package.json ./
COPY prisma/schema.prisma ./prisma/

RUN npm install

COPY . .
COPY .env ./.env

RUN npm run build



FROM node:21-alpine

# Use ARG to accept build-time variables
# ARG DATABASE_URL
# ARG JWT_SECRET

# Use ENV to make them available during runtime
# ENV DATABASE_URL=$DATABASE_URL
# ENV JWT_SECRET=$JWT_SECRET

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY prisma/schema.prisma ./prisma/
COPY prisma/seed.ts ./prisma/
COPY .env ./.env

RUN npm install --omit=dev

RUN npx prisma generate
RUN npx prisma migrate deploy
RUN npx prisma db push

EXPOSE 4000

CMD [ "npm", "run", "start:prod" ]
