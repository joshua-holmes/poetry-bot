########## BACKEND BUILD ##########
FROM rust:latest AS backend

WORKDIR /app

COPY server/Cargo.toml server/Cargo.lock ./
COPY server/src/ src/

RUN cargo build --release

########## FRONTEND BUILD ##########
FROM node:latest AS frontend

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY src/ src/
COPY public/ public/
COPY tsconfig.* vite.config.ts index.html ./

RUN npm run build

########## FINAL BUILD ##########
FROM debian:bookworm-slim

# install libssl.so.3
RUN apt-get update && apt-get install -y \
    # installing openssl instead of this also works
    libssl-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY --from=backend /app/target/release/server .
COPY --from=frontend /app/dist ./dist

CMD ["./server"]
