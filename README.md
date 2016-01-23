# Magento 2 Docker

In order to run it on Mac or Windows you need to install [VirtualBox](https://www.virtualbox.org/) and 
[Docker Toolbox](https://www.docker.com/docker-toolbox). Further you have to create a docker host VM e.g. with
following command:

    docker-machine create --driver virtualbox \
        --virtualbox-cpu-count "2" \
        --virtualbox-memory "4096" \
        --virtualbox-disk-size "64000" \
        dev

## Run it

    ## Checkout Magento sources (git submodule)
    git submodule update --init
    
    ## Deploy Magento2 sources to www dir
    ant deploy-magento-sources
    
    ## Build images (Dockerfile)
    docker-compose build
    
    ## Run container
    docker-compose up -d

## Magento 2 installation

    docker exec -ti <NAME_OF_WEB_CONTAINER> composer --working-dir=/var/www/ install
    docker exec -ti <NAME_OF_WEB_CONTAINER> /var/www/bin/magento setup:install \
        --backend-frontname="admin" \
        --db-host="mysql" --db-name="magento" \
        --db-user="magento" --db-password="password" \
        --base-url="http://magento2.docker/" \
        --language="de_DE" \
        --timezone="Europe/Berlin" \
        --currency="EUR" \
        --use-secure=1 \
        --base-url-secure="https://magento2.docker/" \
        --use-secure-admin=1 \
        --admin-user="admin" \
        --admin-password="password123" \
        --admin-email="team@techdivision.com" \
        --admin-firstname="Super" \
        --admin-lastname="Admin" \
        --cleanup-database \
        --sales-order-increment-prefix="DEV" \
        --use-sample-data

## Develop Magento modules
Checkout your modules into src directory e.g. `git clone git@github.com:group/module-name.git src/app/code/Module/Name`
and deploy module into instance with `ant deploy-code`. 