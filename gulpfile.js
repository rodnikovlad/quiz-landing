const { src, dest, watch, series, parallel } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const browserSync = require('browser-sync').create();
const clean = require('gulp-clean');

const paths = {
    styles: {
        src: 'scss/**/*.scss',
        dest: 'assets/css/'
    },
    html: {
        src: '*.html',
        dest: './'
    },
    js: {
        src: ['assets/js/**/*.js', 'js/**/*.js'],
        dest: 'assets/js/'
    },
    images: {
        src: ['assets/images/**/*', 'img/**/*'],
        dest: 'assets/images/'
    },
    fonts: {
        src: 'assets/fonts/**/*',
        dest: 'assets/fonts/'
    },
    libs: {
        src: 'libs/**/*',
        dest: 'libs/'
    },
    dist: 'dist/'
};

function styles() {
    return src(paths.styles.src)
        .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
        .pipe(dest(paths.dist + paths.styles.dest));
}

function html() {
    return src(paths.html.src)
        .pipe(dest(paths.dist));
}

function scripts() {
    return src(paths.js.src, { allowEmpty: true })
        .pipe(dest(paths.dist + paths.js.dest));
}

function images() {
    return src(paths.images.src, { allowEmpty: true })
        .pipe(dest(paths.dist + paths.images.dest));
}

function fonts() {
    return src(paths.fonts.src, { allowEmpty: true })
        .pipe(dest(paths.dist + paths.fonts.dest));
}

function libs() {
    return src(paths.libs.src, { base: '.', allowEmpty: true })
        .pipe(dest(paths.dist));
}

function cleanDist() {
    return src(paths.dist, { read: false, allowEmpty: true })
        .pipe(clean({ force: true }));
}

function serve() {
    browserSync.init({
        server: {
            baseDir: './',
            directory: true
        },
        notify: false,
        open: true
    });

    watch('scss/**/*.scss', stylesDev);
    watch(paths.html.src).on('change', browserSync.reload);
    watch(['assets/js/**/*.js', 'js/**/*.js']).on('change', browserSync.reload);
}

function stylesDev() {
    return src(paths.styles.src)
        .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
        .pipe(dest(paths.styles.dest))
        .pipe(browserSync.stream());
}

exports.default = series(stylesDev, serve);
exports.build = series(
    cleanDist,
    parallel(styles, html, scripts, images, fonts, libs)
);