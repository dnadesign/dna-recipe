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
	rm_hover = require('postcss-hover'), // used to remove pure's default hover states
	cleanCSS = require('gulp-clean-css'),

	eslint = require('gulp-eslint'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	plumber = require('gulp-plumber');
	rework = require('gulp-rework'),
	pureGrids = require('rework-pure-grids'),
	sassJson = require('gulp-sass-json'),


/**
 * Live browser previews
 * NOTE: This will use a json object outside your project root if you provide one. 
 */
gulp.task('browserSync', ['make-js', 'make-css'], function() {
	var path = "../../../_npm_environment.json",
		file,
		defaultConfig = {
			open: 'external',
			host: 'dna-recipe.dev', // this can be anything at .dev, or localhost, or...
			proxy: "dna-recipe.dev", // this needs to be your project (localhost, .dev, vagrant domain et al)
			watchTask: true
		},
		bsConfig,
		newConfig;


	if (fs.existsSync(path)) {
	    file = fs.readFile(path, 'utf8', function (err,data) {
			if (err) {
				return console.log(err);
			}
            data = JSON.parse(data);

            if(bsConfig = data.browserSync) {
				if(bsConfig.disabled === true) {
					console.log('browsersync disabled');
				    return;
				}

				newConfig = Object.assign({}, defaultConfig, bsConfig);

				browserSync.init(newConfig);
            }
	    });
	} else {
		browserSync.init(defaultConfig);
	}
});


/**
 * Create JSON objects from SCSS variables
 */
gulp.task('json', function() {
	return gulp.src('build/sass/utilities/_var-breakpoints.scss')
		.pipe(sassJson())
		.pipe(gulp.dest('js/src/'))
});


/**
 * Move pure from node_modules into our distribution folder
 * We don't want to edit this file, as there's no real need with such a small framework
 */
gulp.task('pure', ['json'], function() {
	var path='js/src/var-breakpoints.json';
	var mediaQueries = {};

	// Read breakpoints and generate mediaQueries object for rework
	if (fs.existsSync(path)) {
	    file = fs.readFile(path, 'utf8', function (err,data) {
			if (err) {
				return console.log(err);
			}
            data = JSON.parse(data);

			for (var k in data.breakpoints) {
				mediaQueries[k] = "screen and (min-width:" + data.breakpoints[k] + ")";
			}
	    });
	}

	return gulp.src([
		'node_modules/purecss/build/pure.css',
		'node_modules/purecss/build/grids-responsive.css'
		])
		.pipe(plumber())
		.pipe(rework(pureGrids.units({ mediaQueries: mediaQueries })))
		.pipe(postcss([ rm_hover() ]))
		.pipe(concat('pure.css'))
		.pipe(rename({
			suffix: '.src'
		}))
		.pipe(plumber.stop())
		.pipe(gulp.dest('css/'))
});




/**
 * Compile sass, allowing for wildcard @imports. Then run autoprefixer on the output
 * so that we don't have to manually write browser prefixes
 * Use sourcemaps so that we know where things have come from when using these files
 * Minify CSS using cleanCSS, and output to an style.css file.
 */
gulp.task('make-css', function() {
	return gulp.src('build/sass/style.scss')
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(bulkSass())
		.pipe(sass()) // Using gulp-sass
		.pipe(cleanCSS({compatibility: 'ie9'}))
		.pipe(postcss([ autoprefixer({ browsers: ['last 2 versions'] }) ]))
		.pipe(rucksack({
			alias: false
		}))
		.pipe(concat('style.css'))
		.pipe(sourcemaps.write('.'))
		.pipe(plumber.stop())
		.pipe(gulp.dest('css/'))
});


/**
 * Minify editor.css and move into css root
 * NOTE: we aren't renaming the file, as silverstripe looks for editor.css by default
 */
gulp.task('cms-css', function() {
	return gulp.src('build/sass/editor.scss')
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(bulkSass())
		.pipe(sass()) // Using gulp-sass
		.pipe(cleanCSS({compatibility: 'ie9'}))
		.pipe(postcss([ autoprefixer({ browsers: ['last 2 versions'] }) ]))
		.pipe(rucksack({
			alias: false
		}))
		.pipe(concat('editor.css'))
		.pipe(sourcemaps.write('.'))
		.pipe(plumber.stop())
		.pipe(gulp.dest('css/'))
});


/**
 * Get all .js files in build/js/components
 * Run them through jslinting, concat into a single file, uglify,
 * and save as a script.min file
 */
gulp.task('make-js-components', function() {
	return gulp.src('build/js/components/**/*.js')
		.pipe(plumber())
		.pipe(eslint({
			globals: {
				'jQuery' : true,
				'console' : true,
				'document': true
			},
			envs: [
				'browser'
			]
		})).pipe(eslint.format())
		.pipe(sourcemaps.init())
		.pipe(concat('components.js'))
		.pipe(plumber.stop())
		.pipe(gulp.dest('js/src/'))
		.pipe(sourcemaps.write('.'))
});


/**
 * Include JS dependencies added with npm
 */
gulp.task('make-js-npm', function() {
	return gulp.src([
			'node_modules/jquery/dist/jquery.js',
			'node_modules/slick-carousel/slick/slick.js'
		])
		.pipe(concat('npm-libs.src.js'))
		.pipe(gulp.dest('js/src/'))
});


/**
 * Include js libraries by hand to allow for specific ordering
 * Skip linting, as these are likely not our own files,
 * Combine with our other dependeniies, uglify, and write to folder
 */
gulp.task('make-js', ['make-js-components', 'make-js-npm'], function() {
	return gulp.src([
			'js/src/npm-libs.src.js',
			'build/js/lib/html5shiv-printshiv.js',
			'build/js/lib/modernizr.min.js',
			'build/js/lib/classList.js',
			'build/js/lib/mutation-observers.js',
			'build/js/lib/pointereventspolyfill.js',
			'build/js/lib/jquery.placeholder.js',
			'build/js/lib/toggles-switches.js',
			'build/js/lib/jquery.whim.src.js',
			'build/js/lib/response.src.js',
			'build/js/do.src.js',
			'build/js/browser_detection.src.js',
			'build/js/responseTrigger.src.js',

			'js/src/components.js',

			'build/js/start.src.js'
		])
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(concat('script.js'))
		.pipe(gulp.dest('js/src/'))
		.pipe(uglify())
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(sourcemaps.write('.'))
		.pipe(plumber.stop())
		.pipe(gulp.dest('js'))
});

gulp.task('watch', ['pure', 'make-css', 'cms-css', 'make-js', 'browserSync'], function () {
	gulp.watch('build/sass/**/*.scss', ['make-css', 'cms-css', browserSync.reload]); //watch sass in project sass folder, run tasks
	gulp.watch('build/js/**/*.js', ['make-js', browserSync.reload]);  //watch js in project js folder, run tasks
});

gulp.task('default', ['watch']);
