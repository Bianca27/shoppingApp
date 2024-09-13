FROM php:8.3.11

ENV NVM_DIR /usr/local/nvm
RUN mkdir -p $NVM_DIR
#install node
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash
RUN apt-get install -y nodejs
#install composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/bin/ --filename=composer

WORKDIR /var/www/html
ENV APP_HOME /var/www/html
COPY . $APP_HOME

RUN composer install --no-interaction && \
    npm install

RUN docker-php-ext-install mysqli pdo pdo_mysql
