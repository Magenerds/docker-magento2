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
    
Finally install Magento 2 (it will be installed in developer mode):

    ## If you want to use sample data do the following before installing
    cd sources/sample-data
    git tag
    git checkout 2.0.0
    ant deploy-sample-data
    
    ## runs composer install and executes installation script
    ant install-m2
    
## Develop Magento modules
Checkout your modules into src directory e.g. `git clone git@github.com:group/module-name.git src`. Next open the
gulpfile.js and edit `app/code/Vendor/MyModule/` of `options` array to your module name.

Whenever you have to run `bin/magento setup:upgrade` just execute `ant m2-setup-upgrade`.

As we use Mac OS the only way to sync files to the VM is vboxsf which is so slow that it is impossible to develop
with that :-) But there is a solution for that: Enter `gulp` into console in order to start the gulpfile. It watches
the `src` folder for your development changes. If you want to change the instance sources in `www` folder just run
`ant copy-www` in order to sync your instance changes. But remember: Never change the core or Ben Marks is hunting you :-)
 
![Edit the core](https://d21ii91i3y6o6h.cloudfront.net/gallery_images/from_proof/11223/large/1458314216/hey-did-you-just-edit-the-core.png "Edit the core")