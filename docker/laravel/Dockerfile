FROM node:22.17.1-alpine AS node_deps

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --prefer-offline --no-audit --progress=false --loglevel=error

FROM composer:2.7.6 AS composer

WORKDIR /app

RUN docker-php-ext-install pcntl

COPY composer.json composer.lock ./
RUN composer install --prefer-dist --no-dev --no-scripts --no-progress --no-interaction

FROM node:22.17.1-alpine AS node_build

WORKDIR /app

COPY --from=node_deps /app/node_modules ./node_modules
COPY --from=composer /app/vendor ./vendor
COPY package.json .

COPY vite.config.ts .
COPY tsconfig.json .
COPY components.json .
COPY eslint.config.js .
COPY resources/ ./resources/

RUN npm run build:ssr

FROM dunglas/frankenphp

WORKDIR /app

RUN install-php-extensions \
    redis \
    pdo_pgsql \
    zip \
    sockets \
    intl \
    pcntl

COPY --from=composer /usr/bin/composer /usr/bin/composer
COPY --from=composer /app/vendor /app/vendor
COPY --from=node_build /app/public/build /app/public/build

COPY . .

RUN composer dump-autoload --optimize --no-dev --classmap-authoritative

COPY ./docker/laravel/start-container.sh ./start-container.sh
RUN chmod +x ./start-container.sh

ENTRYPOINT [ "./start-container.sh" ]

EXPOSE 8080
