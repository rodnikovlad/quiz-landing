const { src, dest, watch, series, parallel } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const browserSync = require('browser-sync').create();
const clean = require('gulp-clean');

// ===== ПУТИ =====
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
        src: 'assets/js/**/*.js',
        dest: 'assets/js/'
    },
    images: {
        src: 'assets/images/**/*',
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

// ===== SCSS =====
function styles() {
    return src(paths.styles.src)
        .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
        .pipe(dest(paths.dist + paths.styles.dest));
}

// ===== HTML =====
function html() {
    return src(paths.html.src)
        .pipe(dest(paths.dist));
}

// ===== JS =====
function scripts() {
    return src(paths.js.src)
        .pipe(dest(paths.dist + paths.js.dest));
}

// ===== IMAGES =====
function images() {
    return src(paths.images.src)
        .pipe(dest(paths.dist + paths.images.dest));
}

// ===== FONTS =====
function fonts() {
    return src(paths.fonts.src)
        .pipe(dest(paths.dist + paths.fonts.dest));
}

// ===== LIBS (Swiper) =====
function libs() {
    return src(paths.libs.src, { base: '.' })
        .pipe(dest(paths.dist));
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
            baseDir: './',
            directory: true
        },
        notify: false,
        open: true
    });

    watch('scss/**/*.scss', stylesDev);
    watch(paths.html.src).on('change', browserSync.reload);
    watch(paths.js.src).on('change', browserSync.reload);
    watch(paths.images.src).on('change', browserSync.reload);
}

// ===== DEV STYLES =====
function stylesDev() {
    return src(paths.styles.src)
        .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
        .pipe(dest(paths.styles.dest))
        .pipe(browserSync.stream());
}

// ===== TASKS =====
exports.default = series(stylesDev, serve);
exports.build = series(
    cleanDist,
    parallel(styles, html, scripts, images, fonts, libs)
);