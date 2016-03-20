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
    eval "$(docker-machine env dev)"
    
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

You can change these default settings in build.default.properties before installing Magento. In order to install
Magento via composer you need to generate authentication keys first following this instruction: 
http://devdocs.magento.com/guides/v2.0/install-gde/prereq/connect-auth.html
Save these keys in your local home directory like the following:

    vi ~/.composer/auth.json
    
Enter the following content into the file:

    {
        "http-basic": {
            "repo.magento.com": {
                "username": "YOUR-GENERATED-KEY",
                "password": "YOUR-GENERATED-PASSWORD"
            }
        }
    }
    
Finally install Magento 2:

    ## runs composer install and executes installation script
    ant m2-install
    
## Install Magento 2 sample data

    ## Run the following command
    ant install-sample-data
    
## Develop Magento modules
Checkout your modules into src directory e.g. `git clone git@github.com:group/module-name.git src/app/code/Module/Name`
and deploy module into instance with `ant deploy-code`. 

Whenever you have to run `bin/magento setup:upgrade` just execute `ant m2-setup-upgrade`.

As we use Mac OS the only way to sync files to the VM is vboxsf which is so slow that it is impossible to develop
with that :-) But there is a solution: https://github.com/brikis98/docker-osx-dev Follow the instructions on the
github site in order to install it. Afterwards you can sync local files from `www` directory to the docker VM via
`docker-osx-dev` command. When asked the following answer with `yes`:

    Found VirtualBox shared folders on your Boot2Docker VM. These may void any performance benefits from using docker-osx-dev
    Would you like this script to remove them?
    1) yes
    2) no

It initially takes a little bit of time to sync the complete directory. But afterwards
changes during development are synced really fast. But this step is optionally. You can also develop without docker-osx-dev... 
but it is slow :-)