const gulp = require('gulp'),
	fs = require('fs'),
	del = require('del'),
	autoprefixer = require('autoprefixer'),
	browserSync = require('browser-sync').create(),
	rmHover = require('postcss-hover'),
	inlinesvg = require('postcss-inline-svg'),
	pump = require('pump'),
	/**
     * Load gulp prefixed plugins from our package.json
     * Plugins can be loaded with: load.name(), rather than just name().
     * More information: https://w+ww.npmjs.com/package/gulp-load-plugins
     */
	load = require('gulp-load-plugins')(),
	project = 'dna-recipe', // Your project name
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
gulp.task('browserSync', (done) => {
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
		fs.readFile(path, 'utf8', function (err, data) {
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

	done();
});

gulp.task('clean', () => {
	return del([PATHS.dist + 'css/', 'js/']);
});

/**
 * Minify all the svg - Make sure you're using the correct folder for your
 * svg files. You may also want to specify a different destination to the target
 */
gulp.task('svgo', () => {
	return pump([
		gulp.src(PATHS.src + 'svg/**/*.svg'),
		load.svgmin()
            .on('error', swallowError),
		gulp.dest(PATHS.dist + 'svg')
	]);
});

/**
 * Create JSON objects from SCSS variables
 */
gulp.task('json', () => {
	return pump([
		gulp.src(PATHS.src + 'sass/utilities/_var-breakpoints.scss'),
		load.sassJson()
            .on('error', swallowError),
		gulp.dest(PATHS.dist + 'js/src/')
	]);
});

/**
 * Move pure from node_modules into our distribution folder
 * We don't want to edit this file, as there's no real need with such a small framework
 */
gulp.task('pure', () => {
	return pump([
		gulp.src(['node_modules/purecss/build/pure.css']),
		load.postcss([rmHover()])
            .on('error', swallowError),
		load.concat('pure.css'),

		load.rename({
			suffix: '.src'
		}),

		gulp.dest(PATHS.dist + 'css/')
	]);
});

/**
 * Compile sass, allowing for wildcard @imports. Then run autoprefixer on the output
 * so that we don't have to manually write browser prefixes
 * Use sourcemaps so that we know where things have come from when using these files
 * Minify CSS using cleanCSS, and output to an style.css file.
 */
gulp.task('make-css', () => {
	return pump([
		gulp.src(PATHS.src + 'sass/style.scss'),
		load.sourcemaps.init(),
		load.sassBulkImport(),
		load.sass() // Using gulp-sass
            .on('error', swallowError),
		load.cleanCss({ compatibility: 'ie9' }),
		load.postcss([
			autoprefixer({ browsers: ['last 2 versions'] }),
			inlinesvg({
				path: PATHS.dist + 'svg/'
			})
		]),
		load.rucksack({
			alias: false
		}),
		load.concat('style.css'),
		load.sourcemaps.write('.'),
		gulp.dest(PATHS.dist + 'css/'),
		browserSync.stream()
	]);
});

/**
 * Minify editor.css and move into css root
 * NOTE: we aren't renaming the file, as silverstripe looks for editor.css by default
 */
gulp.task('cms-css', () => {
	return pump([
		gulp.src(PATHS.src + 'sass/editor.scss'),
		load.sourcemaps.init(),
		load.sassBulkImport(),
		load.sass() // Using gulp-sass
            .on('error', swallowError),
		load.cleanCss({ compatibility: 'ie9' }),
		load.postcss([
			autoprefixer({ browsers: ['last 2 versions'] }),
			inlinesvg({
				path: PATHS.dist + 'svg/'
			})
		]),
		load.rucksack({
			alias: false
		}),
		load.concat('editor.css'),
		load.sourcemaps.write('.'),
		gulp.dest(PATHS.dist + 'css/')
	]);
});

/**
 * Get all .js files in build/js/components
 * Run them through jslinting, concat into a single file, uglify,
 * and save as a script.min file
 */
gulp.task('makejs:components', () => {
	return pump([
		gulp.src(PATHS.src + 'js/components/**/*.js'),
		load.eslint({
			globals: ['jQuery', 'console', 'document', 'DO'],
			envs: ['browser']
		}),
		load.eslint.format(),
		load.sourcemaps.init()
            .on('error', swallowError),
		load.concat('components.js'),
		gulp.dest(PATHS.dist + 'js/src/'),
		load.sourcemaps.write('.')
	]);
});

/**
 * Include JS dependencies added with npm
 */
gulp.task('makejs:npm', () => {
	return pump([
		gulp.src([
			'node_modules/jquery/dist/jquery.js',
			'node_modules/slick-carousel/slick/slick.js'
		]),
		load.concat('npm-libs.src.js'),
		gulp.dest(PATHS.dist + 'js/src/')
	]);
});

/**
 * Include js libraries by hand to allow for specific ordering
 * Skip linting, as these are likely not our own files,
 * Combine with our other dependeniies, uglify, and write to folder
 */
gulp.task('makejs:main', () => {
	const configJSON = fs.readFileSync(
        PATHS.dist + 'js/src/var-breakpoints.json'
    ),
		config = JSON.parse(configJSON);

	return pump([
		gulp.src([
			'node_modules/babel-polyfill/dist/polyfill.min.js', // includes polyfill for browser compatibility
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
		]),
		load.template({ breakpoints: JSON.stringify(config) })
            .on('error', swallowError),
		load.sourcemaps.init(),
		load.babel()
            .on('error', swallowError),
		load.concat('script.js'),
		gulp.dest(PATHS.dist + 'js/src/'),
		load.if(process.env.NODE_ENV !== 'dev', load.uglify()),
		load.rename({
			suffix: '.min'
		}),
		load.sourcemaps.write('.'),
		gulp.dest(PATHS.dist + 'js'),
		browserSync.stream()
	]);
});

gulp.task('makejs',
    gulp.series('makejs:components', 'makejs:npm', 'makejs:main')
);

gulp.task('html', () => {
	return pump([
		gulp.src([PATHS.src + 'templates/**/*.ss'])
            .on('error', swallowError),
		gulp.dest(PATHS.dist + 'templates'),
		browserSync.stream()
	]);
});

gulp.task('images', () => {
	return pump([
		gulp.src([PATHS.src + 'images/**/*'])
            .on('error', swallowError),
		gulp.dest(PATHS.dist + 'images')
	]);
});

gulp.task('fonts', () => {
	return pump([
		gulp.src([PATHS.src + 'fonts/**/*'])
            .on('error', swallowError),
		gulp.dest(PATHS.dist + 'fonts')
	]);
});

gulp.task('copy', gulp.parallel('images', 'fonts', 'html'));

gulp.task('build', (done) => {
	return gulp.series(
        'clean',
        gulp.parallel('copy', 'svgo', 'pure', 'json'),
        gulp.parallel('make-css', 'cms-css', 'makejs')
    )(done);
});

gulp.task('run', (done) => {
	return gulp.series('build', 'browserSync')(done);
});

gulp.task('watch', () => {
	gulp.watch(PATHS.src + 'sass/**/*.scss', gulp.parallel('make-css', 'cms-css')); // watch sass in project sass folder, run tasks
	gulp.watch(PATHS.src + 'js/**/*.js', gulp.parallel('makejs')); // watch js in project js folder, run tasks
	gulp.watch(PATHS.src + 'svg/**/*.svg', gulp.parallel('svgo')); // Watch for template changes so we can stream to the browser
	gulp.watch(PATHS.src + 'images/**/*.*', gulp.parallel('images'));
	gulp.watch(PATHS.src + 'fonts/**/*.*', gulp.parallel('fonts')); // Watch for template changes so we can stream to the browser
	gulp.watch(PATHS.src + 'templates/**/*.ss', gulp.parallel('html')); // Watch for template changes so we can stream to the browser
});

gulp.task('init', (done) => {
	return gulp.series('run', 'watch')(done);
});

gulp.task('default', gulp.parallel('init'));
