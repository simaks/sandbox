'use strict';

let gulp = require('gulp'),
    copydir = require('copy-dir'),
    del = require('del'),
    fs = require('fs'),
    path = require('path'),
    _ = require('lodash'),
    rebase = require("rebase/tasks/gulp-rebase"),
    notifier = require('node-notifier'),
    runSequence = require('run-sequence'),
    realFavicon = require('gulp-real-favicon'),
    plugins = require('gulp-load-plugins')(),
    browserify = require("browserify"),
    source = require('vinyl-source-stream'),
    tsify = require("tsify"),
    buffer = require('vinyl-buffer'),
    minifier = require('gulp-uglify/minifier'),
    uglifyjs = require('uglify-js-harmony'),
    util = require('gulp-util'),
    concat = require('gulp-concat'),
    sourcemaps = require('gulp-sourcemaps'),
    debug = require('gulp-debug'),
    jasmineBrowser = require('gulp-jasmine-browser'),
    watch = require('gulp-watch'),
    merge = require('merge-stream');


// Gulp Config
let showErrorNotifications = true,
    config = {
        scssFile: './src/scss/style.scss',
        scssWatch: './src/scss/**',
        tsFile: './src/ts/script.ts',
        tsTestFile: './src/ts/test.ts',
        tsWatch: './src/ts/**',

        dist: {
            css: './dist',
            js: './dist'
        },

        browserSupport: [
            "last 2 versions",
            "ie 9",
            "ie 10",
            "ie 11"
        ]
    };

let errorLogger = function (headerMessage, errorMessage) {
    let header = headerLines(headerMessage);
    header += '\n             ' + headerMessage + '\n           ';
    header += headerLines(headerMessage);
    header += '\r\n \r\n';
    plugins.util.log(plugins.util.colors.red(header) + '             ' + errorMessage + '\r\n')

    if (showErrorNotifications) {
        notifier.notify({
            'title': headerMessage,
            'message': errorMessage,
            'contentImage': __dirname + "/gulp_error.png"
        });
    }
};

let headerLines = function (message) {
    let lines = '';
    for (let i = 0; i < (message.length + 4); i++) {
        lines += '-';
    }
    return lines;
};

function swallowError(error) {
    console.error('\\/ \\/ \\/ \\/ \\/ \\/ \\/ \\/ \\/ \\/ \\/ ERROR \\/ \\/ \\/ \\/ \\/ \\/ \\/ \\/ \\/ \\/ \\/\n\n'
        + error.toString()
        + '\n\n/\\ /\\ /\\ /\\ /\\ /\\ /\\ /\\ /\\ /\\ /\\ ERROR /\\ /\\ /\\ /\\ /\\ /\\ /\\ /\\ /\\ /\\ /\\');
    this.emit('end')
}

const compileTypescript = function (env) {
    return function () {
        let result = browserify({
            basedir: '.',
            debug: true,
            entries: [env == 'prod' ? config.tsFile : config.tsTestFile],
            cache: {},
            packageCache: {}
        })
            .plugin(tsify, {target: 'es5'})
            .transform('babelify', {
                presets: ['es2015'],
                extensions: ['.ts']
            })
            .bundle()
            .on('error', swallowError)
            .pipe(env == 'test' ? source('test.js') : source('script.js'))
            .pipe(buffer());

        if (env == 'prod') {
            result = result.pipe(minifier({
                compress: {
                    drop_console: true
                }
            }, uglifyjs));
        } else {
            result = result
                .pipe(sourcemaps.init({loadMaps: true}))
                .pipe(sourcemaps.write('./'));
        }

        return result.pipe(gulp.dest(config.dist.js));
    }
};

gulp.task('front-script-prod', compileTypescript('prod'));

gulp.task('front-script-dev', compileTypescript('dev'));

gulp.task('front-script-test', compileTypescript('test'));


gulp.task('jasmine-phantom', ['front-script-test'], function() {
    return gulp.src(['dist/test.js'])
        .pipe(jasmineBrowser.specRunner({console: true}))
        .pipe(jasmineBrowser.headless());
});

gulp.task('jasmine-watch', function() {
    gulp.watch(config.tsWatch, ['front-script-test']);
    let port = 8888;
    console.info(`URL: http://localhost:${port}/`);
    return gulp.src('dist/test.js')
        .pipe(watch('dist/test.js'))
        .pipe(jasmineBrowser.specRunner())
        .pipe(jasmineBrowser.server({port: port}));
});


gulp.task('scss', function () {
    return gulp.src(['./src/scss/style.scss'])
    // Sass
        .pipe(plugins.rubySass({
            loadPath: './',
            bundleExec: false
        }))
        .on('error', function (err) {
            errorLogger('SASS Compilation Error', err.message);
        })

        // // Combine Media Queries
        // .pipe(plugins.combineMq())

        // // Prefix where needed
        // .pipe(plugins.autoprefixer(config.browserSupport))

        // // Minify output
        // .pipe(plugins.minifyCss())
        //
        // // Rename the file to respect naming covention.
        // .pipe(plugins.rename(function(path){
        //     path.basename += '.min';
        // }))

        // Write to output
        .pipe(gulp.dest('./dist/'))
        ;
});

gulp.task('favicon', function (done) {
    realFavicon.generateFavicon({
        masterPicture: 'src/Nfq/EtapliusBundle/Resources/ui/img/etaplius-logo.svg',
        dest: 'web',
        iconsPath: '/',
        design: {
            ios: {
                pictureAspect: 'backgroundAndMargin',
                backgroundColor: '#ffffff',
                margin: '14%',
                assets: {
                    ios6AndPriorIcons: false,
                    ios7AndLaterIcons: false,
                    precomposedIcons: false,
                    declareOnlyDefaultIcon: true
                }
            },
            desktopBrowser: {},
            windows: {
                pictureAspect: 'noChange',
                backgroundColor: '#ffffff',
                onConflict: 'override',
                assets: {
                    windows80Ie10Tile: false,
                    windows10Ie11EdgeTiles: {
                        small: false,
                        medium: true,
                        big: false,
                        rectangle: false
                    }
                }
            },
            androidChrome: {
                pictureAspect: 'noChange',
                themeColor: '#ffffff',
                manifest: {
                    name: 'iDrink',
                    display: 'standalone',
                    orientation: 'notSet',
                    onConflict: 'override',
                    declared: true
                },
                assets: {
                    legacyIcon: false,
                    lowResolutionIcons: false
                }
            },
            safariPinnedTab: {
                pictureAspect: 'silhouette',
                themeColor: '#6bb536'
            }
        },
        settings: {
            scalingAlgorithm: 'Mitchell',
            errorOnImageTooSmall: false
        },
        markupFile: 'faviconData.json'
    }, function () {
        done();
    });
});


gulp.task('watch', function () {
    // Styles
    gulp.watch(config.scssWatch, ['scss']);

    gulp.watch(config.tsWatch, ['front-script-dev']);
});


gulp.task('build', function (done) {
    runSequence(
        [
            // 'favicon',
            'scss',
            'front-script-prod'
        ],
        done);
});


gulp.task('default', function (done) {
    runSequence(
        [
            // 'favicon',
            'scss',
            'front-script-dev'
        ],
        'watch',
        done
    );
});
