FROM node:21-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock ./
COPY prisma/schema.prisma ./prisma/

RUN npm install

COPY . .
# COPY .env ./.env

RUN npm run build



FROM node:21-alpine

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/yarn.lock ./
COPY --from=builder /app/dist ./dist
COPY prisma/schema.prisma ./prisma/
COPY prisma/seed.ts ./prisma/
# COPY .env ./.env

RUN npm install --omit=dev
RUN npm install -D ts-node typescript @types/node

RUN npx prisma generate
RUN npx prisma migrate dev
RUN npx prisma db push

EXPOSE 4000

CMD [ "npm", "run", "start:prod" ]
