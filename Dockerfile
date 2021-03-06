# ARGS

ARG NODE_ENV=production
ARG SERVER_PORT=3000
ARG HOST
ARG JWT_ISSUER
ARG JWT_ACCESS_TOKEN_EXPIRY
ARG JWT_AUTHORIZATION_TOKEN_EXPIRY
ARG JWT_IDENTITY_TOKEN_EXPIRY
ARG JWT_MULTI_FACTOR_TOKEN_EXPIRY
ARG JWT_REFRESH_TOKEN_EXPIRY
ARG CRYPTO_AES_SECRET
ARG CRYPTO_SHA_SECRET
ARG ACCOUNT_OTP_ISSUER
ARG MAILGUN_API_KEY
ARG MAILGUN_DOMAIN
ARG MAILGUN_FROM
ARG REDIS_PORT
ARG MONGO_INITDB_ROOT_USERNAME
ARG MONGO_INITDB_ROOT_PASSWORD
ARG MONGO_HOST
ARG MONGO_EXPOSE_PORT
ARG MONGO_DB_NAME

## VERSION

FROM node:14-alpine AS node

## BUILDER

FROM node AS builder

WORKDIR /app
COPY package*.json ./
RUN npm i
COPY . .
RUN npm run build
EXPOSE ${SERVER_PORT}

## FINAL

FROM node AS final

ENV NODE_ENV ${NODE_ENV}
ENV SERVER_PORT ${SERVER_PORT}
ENV HOST ${HOST}
ENV JWT_ISSUER ${JWT_ISSUER}
ENV JWT_ACCESS_TOKEN_EXPIRY ${JWT_ACCESS_TOKEN_EXPIRY}
ENV JWT_AUTHORIZATION_TOKEN_EXPIRY ${JWT_AUTHORIZATION_TOKEN_EXPIRY}
ENV JWT_IDENTITY_TOKEN_EXPIRY ${JWT_IDENTITY_TOKEN_EXPIRY}
ENV JWT_MULTI_FACTOR_TOKEN_EXPIRY ${JWT_MULTI_FACTOR_TOKEN_EXPIRY}
ENV JWT_REFRESH_TOKEN_EXPIRY ${JWT_REFRESH_TOKEN_EXPIRY}
ENV CRYPTO_AES_SECRET ${CRYPTO_AES_SECRET}
ENV CRYPTO_SHA_SECRET ${CRYPTO_SHA_SECRET}
ENV ACCOUNT_OTP_ISSUER ${ACCOUNT_OTP_ISSUER}
ENV MAILGUN_API_KEY ${MAILGUN_API_KEY}
ENV MAILGUN_DOMAIN ${MAILGUN_DOMAIN}
ENV MAILGUN_FROM ${MAILGUN_FROM}
ENV REDIS_PORT ${REDIS_PORT}
ENV MONGO_INITDB_ROOT_USERNAME ${MONGO_INITDB_ROOT_USERNAME}
ENV MONGO_INITDB_ROOT_PASSWORD ${MONGO_INITDB_ROOT_PASSWORD}
ENV MONGO_HOST ${MONGO_HOST}
ENV MONGO_EXPOSE_PORT ${MONGO_EXPOSE_PORT}
ENV MONGO_DB_NAME ${MONGO_DB_NAME}

RUN apk --no-cache -U upgrade
RUN mkdir -p /home/node/app/dist && chown -R node:node /home/node/app
WORKDIR /home/node/app
RUN npm i -g pm2
COPY package*.json process.yml ./
USER node
RUN npm i --only=production
COPY --chown=node:node --from=builder /app/dist ./dist
EXPOSE ${SERVER_PORT}

ENTRYPOINT ["pm2-runtime", "./process.yml"]
