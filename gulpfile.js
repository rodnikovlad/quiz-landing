const { src, dest, watch, series, parallel } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const browserSync = require('browser-sync').create();
const clean = require('gulp-clean');

// ===== ПУТИ =====
const paths = {
    styles: 'scss/main.scss',
    html: '*.html',
    js: 'assets/js/**/*.js',
    images: 'assets/images/**/*',
    fonts: 'assets/fonts/**/*',
    dist: 'dist/'
};

// ===== SCSS =====
function styles() {
    return src(paths.styles)
        .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
        .pipe(dest(paths.dist + 'assets/css'));
}

// ===== HTML =====
function html() {
    return src(paths.html)
        .pipe(dest(paths.dist));
}

// ===== JS =====
function scripts() {
    return src(paths.js)
        .pipe(dest(paths.dist + 'assets/js'));
}

// ===== IMAGES =====
function images() {
    return src(paths.images)
        .pipe(dest(paths.dist + 'assets/images'));
}

// ===== FONTS =====
function fonts() {
    return src(paths.fonts)
        .pipe(dest(paths.dist + 'assets/fonts'));
}

// ===== CLEAN DIST =====
function cleanDist() {
    return src(paths.dist, { read: false, allowEmpty: true })
        .pipe(clean());
}

// ===== DEV SERVER =====
function serve() {
    browserSync.init({
        server: {
            baseDir: './'
        }
    });

    watch('scss/**/*.scss', series(stylesDev));
    watch(paths.html).on('change', browserSync.reload);
    watch(paths.js).on('change', browserSync.reload);
}

// ===== DEV STYLES =====
function stylesDev() {
    return src(paths.styles)
        .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
        .pipe(dest('assets/css'))
        .pipe(browserSync.stream());
}

// ===== TASKS =====
exports.default = series(stylesDev, serve);
exports.build = series(
    cleanDist,
    parallel(styles, html, scripts, images, fonts)
);