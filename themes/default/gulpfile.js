const gulp = require('gulp'),
	fs = require('fs'),
	del = require('del'),
	gulpLoadPlugins = require('gulp-load-plugins'),
	autoprefixer = require('autoprefixer'),
	browserSync = require('browser-sync').create(),
	runSequence = require('run-sequence'),
	rmHover = require('postcss-hover'),
	inlinesvg = require('postcss-inline-svg'),
	$ = gulpLoadPlugins();

const project = 'dna-recipe'; // your project name

const PATHS = {
	srcDir: './src',
	distDir: './'
};

function swallowError(error) {
	console.log(error.toString());
	this.emit('end');
}

/**
 * Live browser previews
 * NOTE: This will use a json object outside your project root if you provide one.
 */
gulp.task('browserSync', () => {
	if (browserSync.active) {
		return;
	}

	const path = '../../../_npm_environment.json',
		defaultConfig = {
			open: 'external',
			host: project + '.dev', // this can be anything at .dev, or localhost, or...
			proxy: project + '.dev', // this needs to be your project (localhost, .dev, vagrant domain et al)
			watchTask: true,
			injectChanges: true
		};

	let bsConfig;

	if (fs.existsSync(path)) {
		fs.readFile(path, 'utf8', function(err, data) {
			if (err) {
				return console.log(err);
			}
			data = JSON.parse(data);

			// check for project specific config options
			data = data[project] || data;

			if ((bsConfig = data.browserSync)) {
				if (bsConfig.disabled === true) {
					console.log('browsersync disabled');
					return;
				}

				browserSync.init(Object.assign({}, defaultConfig, bsConfig));
			}
		});
	} else {
		browserSync.init(defaultConfig);
	}
});

gulp.task('clean', () => {
	return del(['./css', './images', './js']);
});

/**
 * Minify all the svg - Make sure you're using the correct folder for your
 * svg files. You may also want to specify a different destination to the target
 */
gulp.task('svgo', () => {
	return gulp
		.src(PATHS.srcDir + '/images/svg/**/*.svg')
		.pipe($.svgmin())
		.on('error', swallowError)
		.pipe(gulp.dest(PATHS.distDir + '/images/svg'));
});

/**
 * Create JSON objects from SCSS variables
 */
gulp.task('json', () => {
	return gulp
		.src(PATHS.srcDir + '/sass/utilities/_var-breakpoints.scss')
		.pipe($.sassJson())
		.on('error', swallowError)
		.pipe(gulp.dest(PATHS.distDir + '/js/src/'));
});

/**
 * Move pure from node_modules into our distribution folder
 * We don't want to edit this file, as there's no real need with such a small framework
 */
gulp.task('pure', ['json'], () => {
	return gulp
		.src(['node_modules/purecss/build/pure.css'])
		.pipe($.postcss([rmHover()]))
		.on('error', swallowError)
		.pipe($.concat('pure.css'))
		.pipe(
			$.rename({
				suffix: '.src'
			})
		)
		.pipe(gulp.dest(PATHS.distDir + '/css/'));
});

/**
 * Compile sass, allowing for wildcard @imports. Then run autoprefixer on the output
 * so that we don't have to manually write browser prefixes
 * Use sourcemaps so that we know where things have come from when using these files
 * Minify CSS using cleanCSS, and output to an style.css file.
 */
gulp.task('make-css', ['pure', 'svgo'], () => {
	return gulp
		.src(PATHS.srcDir + '/sass/style.scss')
		.pipe($.sourcemaps.init())
		.pipe($.sassBulkImport())
		.pipe($.sass()) // Using gulp-sass
		.on('error', swallowError)
		.pipe($.cleanCss({ compatibility: 'ie9' }))
		.pipe(
			$.postcss([
				autoprefixer({ browsers: ['last 2 versions'] }),
				inlinesvg({
					path: PATHS.distDir + '/images/svg/'
				})
			])
		)
		.pipe(
			$.rucksack({
				alias: false
			})
		)
		.pipe($.concat('style.css'))
		.pipe($.sourcemaps.write('.'))
		.pipe(gulp.dest(PATHS.distDir + '/css/'))
		.pipe(browserSync.stream());
});

/**
 * Minify editor.css and move into css root
 * NOTE: we aren't renaming the file, as silverstripe looks for editor.css by default
 */
gulp.task('cms-css', () => {
	return gulp
		.src(PATHS.srcDir + '/sass/editor.scss')
		.pipe($.sourcemaps.init())
		.pipe($.sassBulkImport())
		.pipe($.sass()) // Using gulp-sass
		.on('error', swallowError)
		.pipe($.cleanCss({ compatibility: 'ie9' }))
		.pipe(
			$.postcss([
				autoprefixer({ browsers: ['last 2 versions'] }),
				inlinesvg({
					path: PATHS.distDir + '/images/svg/'
				})
			])
		)
		.pipe(
			$.rucksack({
				alias: false
			})
		)
		.pipe($.concat('editor.css'))
		.pipe($.sourcemaps.write('.'))
		.pipe(gulp.dest(PATHS.distDir + '/css/'));
});

/**
 * Get all .js files in build/js/components
 * Run them through jslinting, concat into a single file, uglify,
 * and save as a script.min file
 */
gulp.task('make-js-components', () => {
	return gulp
		.src(PATHS.srcDir + '/js/components/**/*.js')
		.pipe(
			$.eslint({
				globals: ['jQuery', 'console', 'document', 'DO'],
				envs: ['browser']
			})
		)
		.pipe($.eslint.format())
		.pipe($.sourcemaps.init())
		.on('error', swallowError)
		.pipe($.concat('components.js'))
		.pipe(gulp.dest(PATHS.distDir + '/js/src/'))
		.pipe($.sourcemaps.write('.'));
});

/**
 * Include JS dependencies added with npm
 */
gulp.task('make-js-npm', () => {
	return gulp
		.src([
			'node_modules/jquery/dist/jquery.js',
			'node_modules/slick-carousel/slick/slick.js'
		])
		.pipe($.concat('npm-libs.src.js'))
		.pipe(gulp.dest(PATHS.distDir + '/js/src/'));
});

/**
 * Include js libraries by hand to allow for specific ordering
 * Skip linting, as these are likely not our own files,
 * Combine with our other dependeniies, uglify, and write to folder
 */
gulp.task('make-js', ['json', 'make-js-components', 'make-js-npm'], () => {
	const configJSON = fs.readFileSync(PATHS.distDir + '/js/src/var-breakpoints.json'),
		config = JSON.parse(configJSON);

	return gulp
		.src([
			PATHS.distDir + '/js/src/npm-libs.src.js',
			PATHS.srcDir + '/js/lib/html5shiv-printshiv.js',
			PATHS.srcDir + '/js/lib/modernizr.min.js',
			PATHS.srcDir + '/js/lib/classList.js',
			PATHS.srcDir + '/js/lib/mutation-observers.js',
			PATHS.srcDir + '/js/lib/pointereventspolyfill.js',
			PATHS.srcDir + '/js/lib/jquery.placeholder.js',
			PATHS.srcDir + '/js/lib/toggles-switches.js',
			PATHS.srcDir + '/js/lib/jquery.whim.src.js',
			PATHS.srcDir + '/js/lib/response.src.js',
			PATHS.srcDir + '/js/do.src.js',
			PATHS.srcDir + '/js/browser_detection.src.js',
			PATHS.srcDir + '/js/responseTrigger.src.js',
			PATHS.distDir + '/js/src/components.js',
			PATHS.srcDir + '/js/start.src.js'
		])
		.pipe($.template({ breakpoints: JSON.stringify(config) }))
		.on('error', swallowError)
		.pipe($.sourcemaps.init())
		.pipe($.concat('script.js'))
		.pipe(gulp.dest(PATHS.distDir + '/js/src/'))
		.pipe($.if(process.env.NODE_ENV !== 'dev', $.uglify()))
		.pipe(
			$.rename({
				suffix: '.min'
			})
		)
		.pipe($.sourcemaps.write('.'))
		.pipe(gulp.dest(PATHS.distDir + '/js'))
		.pipe(browserSync.stream());
});

gulp.task('build', cb => {
	runSequence(['clean'], ['make-css', 'cms-css', 'make-js'], cb);
});

gulp.task('watch', ['make-css', 'cms-css', 'make-js', 'browserSync'], () => {
	gulp.watch(PATHS.srcDir + '/sass/**/*.scss', ['make-css', 'cms-css']); // watch sass in project sass folder, run tasks
	gulp.watch(PATHS.srcDir + '/js/**/*.js', ['make-js']); // watch js in project js folder, run tasks
});

gulp.task('default', ['watch']);
