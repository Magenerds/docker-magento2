# Magento 2 Docker

You have to [install docker](https://docs.docker.com/engine/installation/) 
on your machine. If you are running Mac OS it is assumed you use Docker
for Mac.

## Preconfiguration
There is a `build.default.properties` file which holds a lot of 
configurations. There are some general settings:

- **magento.version:** Select the magento version being installed
- **use.sample.data:** If true the sample data will be installed

There are further settings for the Magento 2 instance which you can set
to your wishes. If you want to change the base url you also have to change
the nginx configuration in `conf/nginx/conf.d/vhost-default.conf`.
        
## Setup
    ## set up docker instance and install magento in developer mode
    ant build
    
    ## enter the ip address of the dev machine into your hosts file
    echo "127.0.0.1 magento2.docker" | sudo tee -a /etc/hosts
    
## Develop Magento modules
Checkout your modules into src directory e.g. 
`git clone git@github.com:group/module-name.git src`. Next open the
gulpfile.js and edit `app/code/Vendor/MyModule/` of `options` array to 
your module name.

There is a watcher built with gulp. Just enter `gulp` and it watches
the `src` directory for changes and copies them to the docker instance.

## Useful development commands
- `gulp` Starts the watcher on the src directory
- `ant copy-www-to-docker` Copies the `www` directory to the docker
container
- `ant copy-www-to-local` Copies the `www` directory from the docker
container to your local machine
- `bin/mr2` Runs magerun 2 inside the docker container