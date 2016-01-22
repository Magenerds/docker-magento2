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
    
    ## Build images (Dockerfile)
    docker-compose build
    
    ## Run container
    docker-compose up -d

