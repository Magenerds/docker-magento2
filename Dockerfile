################################################################################
# Docker for Magento 2 development
#
# @author     Florian Sydekum <f.sydekum@techdivision.com>
# @copyright  Copyright (c) 2016 Magenerds <info@magenerds.com>
################################################################################

################################################################################
# Base image and maintainer
################################################################################

FROM techdivision/dnmp

MAINTAINER Florian Sydekum <f.sydekum@techdivision.com>

################################################################################
# Build instructions
################################################################################

## Remove default nginx configs.
RUN rm -f /etc/nginx/conf.d/*

## Copy nginx configuration
COPY conf/nginx /etc/nginx

## Copy magento cron configuration
COPY conf/cron.d/magento /etc/cron.d/magento

## Install magerun
RUN curl -sS https://files.magerun.net/n98-magerun2.phar > /usr/bin/mr2 && chmod +x /usr/bin/mr2

## Expose ports
EXPOSE 80 443