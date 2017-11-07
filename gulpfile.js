'use strict'
const debug = require('gulp-debug');
const gulp = require('gulp');
const stylus = require('gulp-stylus');
const sourcemaps = require('gulp-sourcemaps');
const gulpIf = require('gulp-if');
const del = require('del');
const newer = require('gulp-newer');
const browserSync = require('browser-sync').create();
const notify = require('gulp-notify');
const multipipe = require('multipipe');
const through2 = require('through2').obj;
const File = require('vinyl');
const autoprefixer = require('gulp-autoprefixer');
const eslint = require('gulp-eslint');
const cached = require('gulp-cached');
const pug = require('gulp-pug');
const path = require('path');
const isDevelopment = process.env.NODE_ENV ;

gulp.task('clean', function() {
    return del('public');
});

gulp.task('styles',function() {
	return gulp.src('frontend/styles/main.styl')
		.pipe(gulpIf(isDevelopment == 'development',sourcemaps.init()))
		.pipe(stylus())
		.pipe(autoprefixer())
        .pipe(gulpIf(isDevelopment == 'development',sourcemaps.write()))
		.pipe(gulp.dest('public'));
});

gulp.task('pug', function() {
    return gulp.src('frontend/pug/**/*.*')
		.pipe(cached('pug'))
		.pipe(pug({pretty: true}))
        .pipe(gulp.dest('public/html'));
});

gulp.task('assets', function() {
    return gulp.src('frontend/assets/**')
		.pipe(newer('public/assets'))
		.pipe(gulp.dest('public/assets'));
});

gulp.task('build',gulp.series(
	'clean',
	gulp.parallel('styles','assets','pug')));

gulp.task('watch',function () {
    gulp.watch('frontend/styles/**/*.*',gulp.series('styles'));
    gulp.watch('frontend/assets/**/*.*',gulp.series('assets'));
    gulp.watch('frontend/pug/**/*.*',gulp.series('pug')).on('unlink',function(filepath) {
		delete cached.caches.pug[path.resolve(filepath)];
    });
});

gulp.task('serve',function () {
	browserSync.init({
		server: 'public'
	});
	browserSync.watch('public/**/*.*').on('change',browserSync.reload);
})

gulp.task('dev',
	gulp.series('build', gulp.parallel('watch','serve'))
);
