################################################################################
# Docker for Magento 2 development
#
# @author     Vadim Justus <v.justus@techdivision.com>
# @copyright  Copyright (c) 2015 TechDivision GmbH <info@techdivision.com>
################################################################################

################################################################################
# Base image and maintainer
################################################################################

FROM nginx

MAINTAINER Vadim Justus <v.justus@techdivision.com>

################################################################################
# Build instructions
################################################################################

## Remove default nginx configs.
RUN rm -f /etc/nginx/conf.d/*

## Install packages
RUN apt-get update && apt-get install -my \
    supervisor \
    curl \
    wget \
    git \
    vim \
    cron \
    apache2 \
    libapache2-mod-php5 \
    php5-cli \
    php5-curl \
    php5-fpm \
    php5-gd \
    php5-memcached \
    php5-mysql \
    php5-mcrypt \
    php5-intl \
    php5-xsl \
    php5-sqlite \
    php5-xdebug

# ensure that PHP5 FPM runs as root.
RUN sed -i "s/user = www-data/user = root/" /etc/php5/fpm/pool.d/www.conf
RUN sed -i "s/group = www-data/group = root/" /etc/php5/fpm/pool.d/www.conf

# create SSL certificates
RUN mkdir /etc/nginx/ssl
RUN openssl req -x509 \
    -nodes \
    -days 365 \
    -newkey rsa:2048 \
    -subj "/C=DE/ST=BY/L=Kolbermoor/O=TechDivision GmbH/OU=Munich/CN=techdivision.com/emailAddress=v.justus@techdivision.com" \
    -keyout /etc/nginx/ssl/nginx.key \
    -out /etc/nginx/ssl/nginx.crt

## Install composer
RUN curl -sS https://getcomposer.org/installer | php -- \
    --install-dir=/usr/bin \
    --filename=composer

## Copy configuration file into image
COPY conf/nginx/nginx.conf /etc/nginx/
COPY conf/nginx/conf.d /etc/nginx/conf.d
COPY conf/php/fpm/php.ini /etc/php5/fpm/conf.d/40-custom.ini
COPY conf/php/cli/php.ini /etc/php5/cli/conf.d/40-custom.ini
COPY conf/supervisor/supervisord.conf /etc/supervisor/conf.d/
COPY conf/cron.d/magento /etc/cron.d/magento

## Expose ports
EXPOSE 80 443 9000

## Define entrypoint
CMD ["/usr/bin/supervisord"]