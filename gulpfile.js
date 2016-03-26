// define dependencies
var gulp = require('gulp');
gutil = require('gulp-util');
watch = require('gulp-watch');
runSequence = require('run-sequence');
del = require('del');
exec = require('child_process').exec;

// define options for task usage
var options = {
    m2: {
        backend: {
            frontname: 'admin',
            user: 'admin',
            password: 'password123',
            email: 'team@techdivision.com',
            firstname: 'Super',
            lastname: 'Admin'
        },
        db: {
            name: 'magento',
            password: 'password'
        },
        language: 'de_DE',
        timezone: 'Europe/Berlin',
        currency: 'EUR'
    },
    sources: {
        m2: 'sources/magento2/**/*',
        sampleData: 'sources/sample-data/**/*'
    },
    deploy: {
        src: 'www/'
    },

    //target: {
    //    src: ['src/**/*'],
    //    dir: 'www/magento'
    //},
    //deploy: {
    //    src: ['www/magento/**/*'],
    //    dir: '/var/www/magento/'
    //},
    docker: {
        container: 'dockermagento2_web_1',
        basepath: '/var/www/'
    }
};

/**
 * Cleans target directory
 */
gulp.task('clean', function() {
    return del(options.deploy.src);
});

/**
 * Copies all M2 src files to www
 */
gulp.task('copy-m2', ['clean'], function() {
    return gulp.src(options.sources.m2, { dot: true })
        .pipe(gulp.dest(options.deploy.src + 'magento'));
});

/**
 * Copies all sample data src files to www
 */
gulp.task('copy-sample-data', function() {
    return gulp.src(options.sources.sampleData, { dot: true })
        .pipe(gulp.dest(options.deploy.src + 'magento'));
});

/**
 * Install via composer
 */
gulp.task('composer-install', function(cb) {
    exec('composer --working-dir=' + options.deploy.src + 'magento install', function (err, stdout, stderr) {
        cb(err);
    });
});

/**
 * Installs Magento 2 in container
 */
gulp.task('install-m2', function(cb) {
    return runSequence('copy-m2', 'composer-install', 'deploy', function() {
        exec("docker exec -t " + options.docker.container + " /var/www/magento/bin/magento setup:install "
            + "--backend-frontname='" + options.m2.backend.frontname + "' "
            + "--db-host='mysql' --db-name='" + options.m2.db.name + "' "
            + "--db-user='magento' --db-password='" + options.m2.db.password + "' "
            + "--base-url='http://magento2.docker/' "
            + "--language='" + options.m2.language + "' "
            + "--timezone='" + options.m2.timezone + "' "
            + "--currency='" + options.m2.currency + "' "
            + "--use-secure=1 "
            + "--base-url-secure='https://magento2.docker/' "
            + "--use-secure-admin=1 "
            + "--admin-user='" + options.m2.backend.user + "' "
            + "--admin-password='" + options.m2.backend.password + "' "
            + "--admin-email='" + options.m2.backend.email + "' "
            + "--admin-firstname='" + options.m2.backend.firstname + "' "
            + "--admin-lastname='" + options.m2.backend.lastname + "' "
            + "--cleanup-database "
            + "--sales-order-increment-prefix='DEV' "
            + "--use-sample-data"
        );
    });
});

/**
 * Installs the sample data in container
 */
gulp.task('install-sample-data', function(cb) {
    return runSequence('copy-sample-data', 'deploy', 'm2-setup-upgrade', 'm2-setup-compile', cb);
});

/**
 * Runs the Magento 2 setup upgrade script
 */
gulp.task('m2-setup-upgrade', function(cb) {
    exec('docker exec -t ' + options.docker.container + ' /var/www/magento/bin/magento setup:upgrade', function(err, stdout, stderr) {
        cb(err);
    });
});

/**
 * Runs the Magento 2 setup compile script
 */
gulp.task('m2-setup-compile', function(cb) {
    exec('docker exec -t ' + options.docker.container + ' /var/www/magento/bin/magento setup:di:compile', function(err, stdout, stderr) {
        cb(err);
    });
});

/**
 * Deploys all files to specific directory within a docker container defined in option
 */
gulp.task('deploy', function(cb) {
    exec('docker cp ' + options.deploy.src + ' ' + options.docker.container + ':' + options.docker.basepath, function (err, stdout, stderr) {
        cb(err);
    });
});

/**
 * Default task which watches all files in src and linked magento_coresources files for instant deployment
 */
gulp.task('default', function () {
    gutil.log('Watching ', gutil.colors.blue("'www/**/*'"), 'for changes...');
    return watch([options.deploy.src + 'magento/app/code/Magenerds/**/*', 'src/**/*'], { events: ['add', 'unlink', 'change', 'unlinkDir'] }, function(file) {
        // check if directory unlink is going on
        if (file.event === 'unlinkDir') {
            exec('docker exec -t ' + options.docker.container + ' rm -rf ' + options.docker.basepath + file.relative, function () {
                gutil.log('Deleted', gutil.colors.magenta(file.relative), 'on', gutil.colors.blue(options.docker.container));
            });
            return;
        }
        // check if file unlink is going on
        if (file.event === 'unlink') {
            exec('docker exec -t ' + options.docker.container + ' unlink ' + options.docker.basepath + file.relative, function () {
                gutil.log('Deleted', gutil.colors.magenta(file.relative), 'on', gutil.colors.blue(options.docker.container));
            });
            return;
        }
        // create directory first due to problems with addDir event
        exec('docker exec -t ' + options.docker.container + ' mkdir -p ' + options.docker.basepath + file.relative.replace(file.basename, ""), function() {
            // copy file
            exec('docker cp ' + file.path + ' ' + options.docker.container + ':' + options.docker.basepath + file.relative, function () {
                gutil.log('Copied', gutil.colors.magenta(file.relative), 'to', gutil.colors.blue(options.docker.container));
                gutil.log('' + options.docker.basepath + file.relative);
            });
        })
    });
});