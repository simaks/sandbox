'use strict';

/* ==========================================================================
   Gulpfile

   Tasks:
   - gulp (builds for dev + watch)
   - gulp build (builds for prod)
   - gulp watch

   - gulp migrate
   - gulp cc (Clear Cache)
   - gulp fixperms
   - gulp maintenance
   - gulp apachectl
   ========================================================================== */


/* Setup Gulp
   ========================================================================== */
// Require
let gulp = require('gulp'),
    copydir = require('copy-dir'),
    del = require('del'),
    fs = require('fs'),
    path = require('path'),
    _ = require('lodash'),
    rebase = require("rebase/tasks/gulp-rebase"),
    notifier = require('node-notifier'),
    runSequence = require('run-sequence'),
    realFavicon = require ('gulp-real-favicon'),
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
    merge = require('merge-stream');

function swallowError(error) {
    console.error('\\/ \\/ \\/ \\/ \\/ \\/ \\/ \\/ \\/ \\/ \\/ ERROR \\/ \\/ \\/ \\/ \\/ \\/ \\/ \\/ \\/ \\/ \\/\n\n'
        + error.toString()
        + '\n\n/\\ /\\ /\\ /\\ /\\ /\\ /\\ /\\ /\\ /\\ /\\ ERROR /\\ /\\ /\\ /\\ /\\ /\\ /\\ /\\ /\\ /\\ /\\');
    this.emit('end')
}

const compileTypescript = function(env) {
    return function () {
        let result = browserify({
            basedir: '.',
            debug: true,
            entries: [config.tsFile],
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
            .pipe(source('script.js'))
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



// Gulp Config
let showErrorNotifications = true,
    allowChmod = true;



let config = {
    scssFile: './src/scss/front-style.scss',
    tsFile: './src/ts/script.ts',
    tsWatch: './src/ts/**',

    dist: {
        scss: './dist',
        js: './dist'
    },

    browserSupport: [
        "last 2 versions",
        "ie 9",
        "ie 10",
        "ie 11"
    ]
};


/* Styles
   ========================================================================== */
gulp.task('front-styles', function() {
    return gulp.src([config.scssFile])
        // Sass
        .pipe(plugins.rubySass({
            loadPath: './',
            bundleExec: true
        }))
        .on('error', function (err) {
            errorLogger('SASS Compilation Error', err.message);
        })

        // Combine Media Queries
        .pipe(plugins.combineMq())

        // Prefix where needed
        .pipe(plugins.autoprefixer(config.browserSupport))

        // Minify output
        .pipe(plugins.minifyCss())

        // Rename the file to respect naming covention.
        .pipe(plugins.rename(function(path){
            path.basename += '.min';
        }))

        // Write to output
        .pipe(gulp.dest(config.dist.css))

        // Show total size of css
        .pipe(plugins.size({
            title: 'front-styles'
        }));
});

gulp.task('favicon', function(done) {
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
    }, function() {
        done();
    });
});

/* Default tasks
   ========================================================================== */
// Watch
gulp.task('watch', function() {
    // Styles
    gulp.watch(config.scss, ['front-styles']);

    gulp.watch(config.tsWatch, ['front-script-dev']);

    // Images
    gulp.watch(config.img, ['images']);
});


// Build
gulp.task('build', function(done) {
    runSequence(
        [
            // 'favicon',
            'front-styles',
            'front-script-prod'
        ],
    done);
});

// Default
gulp.task('default', function(done) {
    runSequence(
        [
            // 'favicon',
            'front-styles',
            'front-script-dev'
        ],
        'watch',
        done
    );
});
