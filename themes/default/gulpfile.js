var gulp = require('gulp'),
	del = require('del'),
	fs = require("fs"),
	rucksack = require('gulp-rucksack'), //PostCSS CSS super powers library: http://simplaio.github.io/rucksack/docs/
	rename = require('gulp-rename'),
	sourcemaps   = require('gulp-sourcemaps'),
	browserSync = require('browser-sync').create(),

	sass = require('gulp-sass'),
	bulkSass = require('gulp-sass-bulk-import'),
	postcss      = require('gulp-postcss'),
	autoprefixer = require('autoprefixer'),
	cleanCSS = require('gulp-clean-css'),

	jshint = require('gulp-jslint'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify');



/**
 * Live browser previews
 */
gulp.task('browserSync', function() {
	browserSync.init({
		open: 'external',
		host: 'localhost',
		proxy: "localhost/YOURSITENAME",
		watchTask: true
	})
});


/**
 * Move pure from node_modules into our distribution folder
 * We don't want to edit this file, as there's no real need with such a small framework
 */
gulp.task('pure', function() {
	return gulp.src([
		'node_modules/purecss/build/pure.css',
		'node_modules/purecss/build/grids-responsive.css'
		])
		.pipe(concat('pure.css'))
		.pipe(rename({
			suffix: '.src'
		}))
		.pipe(gulp.dest('css/'))
});




/**
 * Compile sass, allowing for wildcard @imports. Then run autoprefixer on the output
 * so that we don't have to manually write browser prefixes
 * Use sourcemaps so that we know where things have come from when using these files
 * Minify CSS using cleanCSS, and output to an style.css file.
 *
 * NOTE: We specify our sources by hand so that they will be in the correct order
 */
gulp.task('make-css', function() {
	return gulp.src([
		'css/pure.src.css',
		'build/sass/style.scss',
		])
		.pipe(sourcemaps.init())
		.pipe(bulkSass())
		.pipe(sass()) // Using gulp-sass
		.pipe(cleanCSS({compatibility: 'ie9'}))
		.pipe(postcss([ autoprefixer({ browsers: ['last 2 versions'] }) ]))
		.pipe(rucksack())
		.pipe(concat('style.css'))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('css/'))
});


/**
 * Minify editor.css and move into css root
 * NOTE: we aren't renaming the file, as silverstripe looks for editor.css by default
 */
gulp.task('cms-css', function() {
	return gulp.src('build/sass/editor.scss')
		.pipe(sourcemaps.init())
		.pipe(bulkSass())
		.pipe(sass()) // Using gulp-sass
		.pipe(cleanCSS({compatibility: 'ie9'}))
		.pipe(postcss([ autoprefixer({ browsers: ['last 2 versions'] }) ]))
		.pipe(rucksack())
		.pipe(concat('editor.css'))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('css/'))
});


/**
 * Get all .src.js files in build/js
 * Run them through jslinting, concat into a single file, uglify,
 * and save as a script.min file
 */
gulp.task('make-js-src', function() {
	return gulp.src([
			'build/js/**/*.src.js'
		])
		.pipe(jshint({
			white: true,
			global: ['jQuery', 'console'],
		}))
		.pipe(sourcemaps.init())
		.pipe(concat('custom.src.js'))
		.pipe(gulp.dest('js/src/'))
		.pipe(sourcemaps.write('.'))
});


/**
 * Include JS dependencies added with npm
 *
 */
gulp.task('make-js-npm', function() {
	return gulp.src([
			'node_modules/jquery/dist/jquery.js'
		])
		.pipe(concat('npm-libs.src.js'))
		.pipe(gulp.dest('js/src/'))
});


/**
 * Include other js libraries by hand to allow for specific ordering
 * Skip linting, as these are likely not our own files,
 * Combine with our other dependeniies, uglify, and write to folder
 */
gulp.task('make-js', ['make-js-src', 'make-js-npm'], function() {
	return gulp.src([
			'build/js/lib/html5shiv-printshiv.js',
			'build/js/lib/modernizr.min.js',
			'js/src/npm-libs.src.js',
			'js/src/custom.js'
		])
		.pipe(sourcemaps.init())
		.pipe(concat('script.js'))
		.pipe(gulp.dest('js/src/'))
		.pipe(uglify())
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('js'))
});



gulp.task('watch', ['pure', 'make-css', 'cms-css', 'make-js', 'browserSync'], function () {
	gulp.watch('build/sass/**/*.scss', ['make-css', 'cms-css', browserSync.reload]); //watch sass in project sass folder, run tasks
	gulp.watch('build/js/**/*.js', ['make-js', browserSync.reload]);  //watch js in project js folder, run tasks
})


gulp.task('default', ['watch']);
