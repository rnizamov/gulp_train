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
const eslint = require('gulp-eslint');

const isDevelopment = process.env.NODE_ENV ;

gulp.task('styles',function() {
	return gulp.src('frontend/styles/main.styl')
		.pipe(gulpIf(isDevelopment == 'development',sourcemaps.init()))
		.pipe(stylus())
        .pipe(gulpIf(isDevelopment == 'development',sourcemaps.write()))
		.pipe(gulp.dest('public'));
});

gulp.task('clean', function() {
	return del('public');
});

gulp.task('assets', function() {
    return gulp.src('frontend/assets/**')
		.pipe(gulp.dest('public/assets'));
});

gulp.task('default',gulp.series(
	'clean',
	gulp.parallel('styles','assets')));

// gulp.task('lint',function(){
// 	return gulp.src('frontend/**/*.js')
// 		.pipe(eslint())
// 		.pipe(eslint.format())
// 		.pipe(eslint.failAfterError());
//  });
//
// gulp.task('styles',function() {
// 	return multipipe (
// 		gulp.src('frontend/styles/main.styl'),
// 		gulpIf(isDevelopment, sourcemaps.init()),
// 		stylus(),
//  		gulpIf(isDevelopment, sourcemaps.write()),
// 		gulp.dest('public')
// 	).on('error', notify.onError());
// });
//
// gulp.task('clean', function() {
// 	return del('public');
// });
//
//
// gulp.task('assets', function() {
// 	const mtimes = {};
// 	return gulp.src('frontend/assets/**/*.*')
// 			.pipe(through2(
// 				function(file, enc, callback){
// 				mtimes[file.relative] = file.stat.mtime;
// 				callback(null,file);
// 			},
// 			function(callback) {
// 				let manifest = new File({
// 					content: new Buffer(JSON.stringify(mtimes)),
// 					base: process.cwd(),
// 					path: process.cwd() + '/manifest.json'
// 				});
// 				this.push(manifest);
// 				callback();
// 			}
// 			))
// 			.pipe(gulp.dest('public'));
// });
//
// gulp.task('build',gulp.series('clean',gulp.parallel('styles','assets')));
//
// gulp.task('watch',function() {
// 	gulp.watch('frontend/styles/**/*.*', gulp.series('styles'));
// 	gulp.watch('frontend/assets/**/*.*', gulp.series('assets'));
// });
//
//
// gulp.task('serve',function() {
// 	browserSync.init({
// 		server: 'public'
// 	});
//
// 	browserSync.watch('public/**/*.*').on('change', browserSync.reload);
// });
//
// gulp.task('dev',gulp.series('build', gulp.parallel('watch','serve')));
