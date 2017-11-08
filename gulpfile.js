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
const combiner = require('stream-combiner2').obj;

var options = {
	src: {
        styl:'src/style/main.styl',
      	template:'src/pug/*.pug',
        image:'src/image/**/*.*'
	},
	build: {
		build:'build',
        css:'build/css',
		html:'build',
        image:'build/image'
	},
	watch: {
        styl:'src/style/**/*.styl',
        template:'src/pug/**/*.pug',
        image:'src/image/**/*.*',
		sync:'build/**/*.*'
	}
};



gulp.task('clean', function() {
    return del(options.build.build);
});

gulp.task('style',function() {
	return combiner(
		gulp.src(options.src.styl),
		gulpIf(isDevelopment == 'development',sourcemaps.init()),
		stylus(),
		autoprefixer(),
        gulpIf(isDevelopment == 'development',sourcemaps.write()),
		gulp.dest(options.build.css)
	).on('error',notify.onError(function(err) {
			return {
				title: 'Style Err',
				message: err.message
			};
		 }));
});

gulp.task('pug', function() {
    return combiner(
		gulp.src(options.src.template),
		cached('pug'),
		pug({pretty: true}),
        gulp.dest(options.build.html)
	).on('error',notify.onError(function(err) {
        return {
            title: 'Pug Err',
            message: err.message
        };
    }));
});

gulp.task('image', function() {
    return combiner(
		gulp.src(options.src.image),
		newer(options.build.image),
		gulp.dest(options.build.image)
	).on('error',notify.onError(function(err) {
        return {
            title: 'Image Err',
            message: err.message
        };
    }));
});

gulp.task('build',gulp.series(
	'clean',
	gulp.parallel('style','image','pug'))
);

gulp.task('watch',function () {
    gulp.watch(options.watch.styl,gulp.series('style'));
    gulp.watch(options.watch.image,gulp.series('image')).on('unlink',function(filepath) {
    });
    gulp.watch(options.watch.template,gulp.series('pug')).on('unlink',function(filepath) {
		delete cached.caches.pug[path.resolve(filepath)];
    });
});

gulp.task('serve',function () {
	browserSync.init({
		server: options.build.html,

	});
	browserSync.watch(options.watch.sync).on('change',browserSync.reload);
});

gulp.task('dev',
	gulp.series('build', gulp.parallel('watch','serve'))
);
