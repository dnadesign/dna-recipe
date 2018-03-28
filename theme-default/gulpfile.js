const gulp = require('gulp'),
	fs = require('fs'),
	del = require('del'),
	autoprefixer = require('autoprefixer'),
	browserSync = require('browser-sync').create(),
	runSequence = require('run-sequence'),
	rmHover = require('postcss-hover'),
	inlinesvg = require('postcss-inline-svg');

/**
 * Load gulp prefixed plugins from our package.json
 * Plugins can be loaded with: load.name(), rather than just name().
 * More information: https://w+ww.npmjs.com/package/gulp-load-plugins
 */
const load = require('gulp-load-plugins')();

const project = 'dna-recipe', // Your project name
	PATHS = {
		src: './src/',
		dist: './dist/' // The path of the dist directory, currently the theme root
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

	const path = '../../_npm_environment.json',
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
	return del([PATHS.dist + 'css/', 'js/']);
});

/**
 * Minify all the svg - Make sure you're using the correct folder for your
 * svg files. You may also want to specify a different destination to the target
 */
gulp.task('svgo', () => {
	return gulp
		.src(PATHS.src + 'svg/**/*.svg')
		.pipe(load.svgmin())
		.on('error', swallowError)
		.pipe(gulp.dest(PATHS.dist + 'svg'));
});

/**
 * Create JSON objects from SCSS variables
 */
gulp.task('json', () => {
	return gulp
		.src(PATHS.src + 'sass/utilities/_var-breakpoints.scss')
		.pipe(load.sassJson())
		.on('error', swallowError)
		.pipe(gulp.dest(PATHS.dist + 'js/src/'));
});

/**
 * Move pure from node_modules into our distribution folder
 * We don't want to edit this file, as there's no real need with such a small framework
 */
gulp.task('pure', () => {
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
		.pipe(gulp.dest(PATHS.dist + 'css/'));
});

/**
 * Compile sass, allowing for wildcard @imports. Then run autoprefixer on the output
 * so that we don't have to manually write browser prefixes
 * Use sourcemaps so that we know where things have come from when using these files
 * Minify CSS using cleanCSS, and output to an style.css file.
 */
gulp.task('make-css', () => {
	return gulp
		.src(PATHS.src + 'sass/style.scss')
		.pipe(load.sourcemaps.init())
		.pipe(load.sassBulkImport())
		.pipe(load.sass()) // Using gulp-sass
		.on('error', swallowError)
		.pipe(load.cleanCss({ compatibility: 'ie9' }))
		.pipe(
			load.postcss([
				autoprefixer({ browsers: ['last 2 versions'] }),
				inlinesvg({
					path: PATHS.dist + 'svg/'
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
		.pipe(gulp.dest(PATHS.dist + 'css/'))
		.pipe(browserSync.stream());
});

/**
 * Minify editor.css and move into css root
 * NOTE: we aren't renaming the file, as silverstripe looks for editor.css by default
 */
gulp.task('cms-css', () => {
	return gulp
		.src(PATHS.src + 'sass/editor.scss')
		.pipe(load.sourcemaps.init())
		.pipe(load.sassBulkImport())
		.pipe(load.sass()) // Using gulp-sass
		.on('error', swallowError)
		.pipe(load.cleanCss({ compatibility: 'ie9' }))
		.pipe(
			load.postcss([
				autoprefixer({ browsers: ['last 2 versions'] }),
				inlinesvg({
					path: PATHS.dist + 'svg/'
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
		.pipe(gulp.dest(PATHS.dist + 'css/'));
});

/**
 * Get all .js files in build/js/components
 * Run them through jslinting, concat into a single file, uglify,
 * and save as a script.min file
 */
gulp.task('make-js-components', () => {
	return gulp
		.src(PATHS.src + 'js/components/**/*.js')
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
		.pipe(gulp.dest(PATHS.dist + 'js/src/'))
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
		.pipe(gulp.dest(PATHS.dist + 'js/src/'));
});

/**
 * Include js libraries by hand to allow for specific ordering
 * Skip linting, as these are likely not our own files,
 * Combine with our other dependeniies, uglify, and write to folder
 */
gulp.task('make-js', ['make-js-components', 'make-js-npm'], () => {
	const configJSON = fs.readFileSync(
			PATHS.dist + 'js/src/var-breakpoints.json'
		),
		config = JSON.parse(configJSON);

	return gulp
		.src([
			PATHS.dist + 'js/src/npm-libs.src.js',
			PATHS.src + 'js/lib/html5shiv-printshiv.js',
			PATHS.src + 'js/lib/modernizr.min.js',
			PATHS.src + 'js/lib/classList.js',
			PATHS.src + 'js/lib/mutation-observers.js',
			PATHS.src + 'js/lib/pointereventspolyfill.js',
			PATHS.src + 'js/lib/jquery.placeholder.js',
			PATHS.src + 'js/lib/toggles-switches.js',
			PATHS.src + 'js/lib/jquery.whim.src.js',
			PATHS.src + 'js/lib/response.src.js',
			PATHS.src + 'js/do.src.js',
			PATHS.src + 'js/browser_detection.src.js',
			PATHS.src + 'js/responseTrigger.src.js',
			PATHS.dist + 'js/src/components.js',
			PATHS.src + 'js/start.src.js'
		])
		.pipe(load.template({ breakpoints: JSON.stringify(config) }))
		.on('error', swallowError)
		.pipe(load.sourcemaps.init())
		.pipe(load.concat('script.js'))
		.pipe(gulp.dest(PATHS.dist + 'js/src/'))
		.pipe(load.if(process.env.NODE_ENV !== 'dev', load.uglify()))
		.pipe(
			load.rename({
				suffix: '.min'
			})
		)
		.pipe(load.sourcemaps.write('.'))
		.pipe(gulp.dest(PATHS.dist + 'js'))
		.pipe(browserSync.stream());
});

gulp.task('html', function() {
	return gulp
		.src([PATHS.src + 'templates/**/*.ss'])
		.on('error', swallowError)
		.pipe(gulp.dest(PATHS.dist + 'templates'))
		.pipe(browserSync.stream());
});

gulp.task('images', function() {
	return gulp
		.src([PATHS.src + 'images/**/*'])
		.on('error', swallowError)
		.pipe(gulp.dest(PATHS.dist + 'images'));
});

gulp.task('fonts', function() {
	return gulp
		.src([PATHS.src + 'fonts/**/*'])
		.on('error', swallowError)
		.pipe(gulp.dest(PATHS.dist + 'fonts'));
});

gulp.task('copy', ['images', 'fonts', 'html']);

gulp.task('build', cb => {
	runSequence(
		['clean'],
		['copy', 'svgo', 'pure', 'json'],
		['make-css', 'cms-css', 'make-js'],
		cb
	);
});

gulp.task('run', cb => {
	runSequence(['build'], ['browserSync'], cb);
});

gulp.task('watch', ['run'], () => {
	gulp.watch(PATHS.src + 'sass/**/*.scss', ['make-css', 'cms-css']); // watch sass in project sass folder, run tasks
	gulp.watch(PATHS.src + 'js/**/*.js', ['make-js']); // watch js in project js folder, run tasks
	gulp.watch(PATHS.src + 'svg/**/*.svg', ['svgo']); // Watch for template changes so we can stream to the browser
	gulp.watch(PATHS.src + 'images/**/*.*', ['images']);
	gulp.watch(PATHS.src + 'fonts/**/*.*', ['fonts']); // Watch for template changes so we can stream to the browser
	gulp.watch(PATHS.src + 'templates/**/*.ss', ['html']); // Watch for template changes so we can stream to the browser
});

gulp.task('default', ['watch']);
