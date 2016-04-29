// define dependencies
var gulp = require('gulp');
gutil = require('gulp-util');
watch = require('gulp-watch');
del = require('del');
exec = require('child_process').exec;

// define options for task usage
var options = {
    module: '',
    dev: {
        src: 'src/**/*',
        www: 'www/magento/'
    },
    docker: {
        container: 'dockermagento2_web_1',
        basepath: '/var/www/magento/'
    }
};

gulp.task('docker-deploy', function () {
    exec('cd src && docker cp . ' + options.docker.container + ':' + options.docker.basepath + options.module);
});

/**
 * Default task which watches all files in src and linked magento_coresources files for instant deployment
 */
gulp.task('default', function () {
    gutil.log('Watching ', gutil.colors.blue("'src/**/*'"), 'for changes...');
    return watch(options.dev.src, { events: ['add', 'unlink', 'change', 'unlinkDir'] }, function (file) {
        // check if directory unlink is going on
        if (file.event === 'unlinkDir') {
            exec('docker exec -t ' + options.docker.container + ' rm -rf ' + options.docker.basepath + options.module + file.relative, function () {
                gutil.log('Deleted', gutil.colors.magenta(file.relative), 'on', gutil.colors.blue(options.docker.container));
                gutil.log(options.docker.basepath + options.module + file.relative);
            });
            exec('rm -rf ' + options.dev.www + options.module + file.relative);
            return;
        }

        // check if file unlink is going on
        if (file.event === 'unlink') {
            exec('docker exec -t ' + options.docker.container + ' unlink ' + options.docker.basepath + options.module + file.relative, function () {
                gutil.log('Deleted', gutil.colors.magenta(file.relative), 'on', gutil.colors.blue(options.docker.container));
                gutil.log(options.docker.basepath + options.module + file.relative);
            });
            exec('unlink ' + options.dev.www + options.module + file.relative);
            return;
        }

        // create directory first due to problems with addDir event
        exec('docker exec -t ' + options.docker.container + ' mkdir -p ' + options.docker.basepath + options.module + file.relative.replace(file.basename, ""), function () {
            // copy file
            exec('docker cp ' + file.path + ' ' + options.docker.container + ':' + options.docker.basepath + options.module + file.relative, function () {
                gutil.log('Copied', gutil.colors.magenta(file.relative), 'to', gutil.colors.blue(options.docker.container));
                gutil.log(options.docker.basepath + options.module + file.relative);
            });
        });
        exec('mkdir -p ' + options.dev.www + options.module + file.relative.replace(file.basename, ""), function () {
            exec('cp ' + file.path + ' ' + options.dev.www + options.module + file.relative);
        });
    });
});
