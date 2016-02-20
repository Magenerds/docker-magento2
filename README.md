# Magento 2 Docker

In order to run it on Mac or Windows you need to install [VirtualBox](https://www.virtualbox.org/) and 
[Docker Toolbox](https://www.docker.com/docker-toolbox). Further you have to create a docker host VM e.g. with
following command:

    docker-machine create --driver virtualbox \
        --virtualbox-cpu-count "2" \
        --virtualbox-memory "4096" \
        --virtualbox-disk-size "64000" \
        dev

## Setup

    ## Build images (Dockerfile)
    docker-compose build
    
    ## Run container
    docker-compose up -d
    
    ## Enter the ip address of the dev machine into your hosts file
    echo "$(docker-machine ip dev) magento2.docker" | sudo tee -a /etc/hosts
    
    ## Checkout Magento sources (git submodule)
    git submodule update --init
    
    ## Change to a specific Magento version (optional)
    cd sources/magento2
    git tag
    git checkout 2.0.0
    
    ## Deploy Magento2 sources to www dir
    ant deploy-magento-sources
    
## Magento 2 installation
Default backend route is /admin

Default backend user: admin

Default backend pass: password123

You can change these default settings in build.default.properties before running the following command.

    ## runs composer install and executes installation script
    ant m2-install
    
## Develop Magento modules
Checkout your modules into src directory e.g. `git clone git@github.com:group/module-name.git src/app/code/Module/Name`
and deploy module into instance with `ant deploy-code`. 

Whenever you have to run `bin/magento setup:upgrade` just execute `ant m2-setup-upgrade`.