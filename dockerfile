FROM node:lts as dependencies
WORKDIR /
COPY package.json ./
RUN npm install --frozen-lockfile

FROM node:lts as builder
WORKDIR /
COPY . .
COPY --from=dependencies /node_modules ./node_modules
RUN npm run build

FROM node:lts as runner
WORKDIR /
ARG DB_CONNECTION_STRING
ARG MY_SECRET_KEY
ENV NODE_ENV production
ENV DB_CONNECTION_STRING $USER_DATABASE_ADDRESS
ENV MY_SECRET_KEY $CRYPTO_SECRET_KEY
# If you are using a custom next.config.js file, uncomment this line.
# COPY --from=builder /my-project/next.config.js ./
COPY --from=builder /public ./public
COPY --from=builder /.next ./.next
COPY --from=builder /node_modules ./node_modules
COPY --from=builder /package.json ./package.json

EXPOSE 3000
CMD ["npm", "start"]