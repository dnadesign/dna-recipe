const gulp = require('gulp'),
	fs = require('fs'),
	del = require('del'),
	autoprefixer = require('autoprefixer'),
	browserSync = require('browser-sync').create(),
	runSequence = require('run-sequence'),
	rmHover = require('postcss-hover'),
	inlinesvg = require('postcss-inline-svg');

// Load gulp plugins from our package.json and attach them to the `load` object.
// Use the plugins just like you would if you'd manually required them,
// but refer to them as load.name(), rather than just name().
// More information: https://www.npmjs.com/package/gulp-load-plugins
const load = require('gulp-load-plugins')();

// Your project name
const project = 'dna-recipe';

const PATHS = {
	// The path of the source directory
	srcDir: './src',
	// The path of the dist directory
	// Note: we are currently saving built files at the root level.

	// TODO: Once supplying a custom `editor.css` file is a stable
	// feature in SilverStripe, re-implement the `dist` directory.
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
		.pipe(load.svgmin())
		.on('error', swallowError)
		.pipe(gulp.dest(PATHS.distDir + '/images/svg'));
});

/**
 * Create JSON objects from SCSS variables
 */
gulp.task('json', () => {
	return gulp
		.src(PATHS.srcDir + '/sass/utilities/_var-breakpoints.scss')
		.pipe(load.sassJson())
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
		.pipe(load.postcss([rmHover()]))
		.on('error', swallowError)
		.pipe(load.concat('pure.css'))
		.pipe(
			load.rename({
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
		.pipe(load.sourcemaps.init())
		.pipe(load.sassBulkImport())
		.pipe(load.sass()) // Using gulp-sass
		.on('error', swallowError)
		.pipe(load.cleanCss({ compatibility: 'ie9' }))
		.pipe(
			load.postcss([
				autoprefixer({ browsers: ['last 2 versions'] }),
				inlinesvg({
					path: PATHS.distDir + '/images/svg/'
				})
			])
		)
		.pipe(
			load.rucksack({
				alias: false
			})
		)
		.pipe(load.concat('style.css'))
		.pipe(load.sourcemaps.write('.'))
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
		.pipe(load.sourcemaps.init())
		.pipe(load.sassBulkImport())
		.pipe(load.sass()) // Using gulp-sass
		.on('error', swallowError)
		.pipe(load.cleanCss({ compatibility: 'ie9' }))
		.pipe(
			load.postcss([
				autoprefixer({ browsers: ['last 2 versions'] }),
				inlinesvg({
					path: PATHS.distDir + '/images/svg/'
				})
			])
		)
		.pipe(
			load.rucksack({
				alias: false
			})
		)
		.pipe(load.concat('editor.css'))
		.pipe(load.sourcemaps.write('.'))
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
			load.eslint({
				globals: ['jQuery', 'console', 'document', 'DO'],
				envs: ['browser']
			})
		)
		.pipe(load.eslint.format())
		.pipe(load.sourcemaps.init())
		.on('error', swallowError)
		.pipe(load.concat('components.js'))
		.pipe(gulp.dest(PATHS.distDir + '/js/src/'))
		.pipe(load.sourcemaps.write('.'));
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
		.pipe(load.concat('npm-libs.src.js'))
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
		.pipe(load.template({ breakpoints: JSON.stringify(config) }))
		.on('error', swallowError)
		.pipe(load.sourcemaps.init())
		.pipe(load.concat('script.js'))
		.pipe(gulp.dest(PATHS.distDir + '/js/src/'))
		.pipe(load.if(process.env.NODE_ENV !== 'dev', load.uglify()))
		.pipe(
			load.rename({
				suffix: '.min'
			})
		)
		.pipe(load.sourcemaps.write('.'))
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
