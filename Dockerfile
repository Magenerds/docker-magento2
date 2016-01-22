################################################################################
# Docker for Magento 2 development
#
# @author     Vadim Justus <v.justus@techdivision.com>
# @copyright  Copyright (c) 2015 TechDivision GmbH <info@techdivision.com>
################################################################################

################################################################################
# Base image and maintainer
################################################################################

FROM ubuntu:14.04
MAINTAINER Vadim Justus <v.justus@techdivision.com>

################################################################################
# Build instructions
################################################################################

## Install packages
RUN apt-get update && apt-get install -my \
    supervisor \
    curl \
    wget \
    git \
    vim \
    apache2 \
    libapache2-mod-php5 \
    php5-cli \
    php5-curl \
    php5-gd \
    php5-mysql \
    php5-mcrypt \
    php5-intl \
    php5-xsl \
    php5-sqlite

## Enable mod_rewrite for apache
RUN a2enmod rewrite

## Enable mcrypt mod for php5
RUN php5enmod mcrypt

## Install composer
RUN curl -sS https://getcomposer.org/installer | php -- \
    --install-dir=/usr/bin \
    --filename=composer

## Copy configuration file into image
COPY conf/apache/vhost.conf /etc/apache2/sites-available/000-default.conf
COPY conf/supervisor/supervisord.conf /etc/supervisor/conf.d/

## Define mountable volumes
VOLUME ["/var/www"]

## Expose ports
EXPOSE 80 443

## Define entrypoint
CMD ["/usr/bin/supervisord"]