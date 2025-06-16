FROM node:18-alpine

# Install build dependencies for SQLite3
RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY package*.json ./

RUN npm install

# Rebuild SQLite3 for Alpine Linux
RUN npm rebuild sqlite3

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"] 