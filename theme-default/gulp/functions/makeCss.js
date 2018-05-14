import dependencies from '../dependencies.js';

export function call(src, dist, concatName) {
	const postCssPlugins = [
			dependencies.inlinesvg({ path: dist + 'svg/' }),
			dependencies.autoprefixer()
		], rucksackConfig = {
			alias: false
		}, cleanCssConfig = { compatibility: 'ie9' };
	dependencies.pump([
		dependencies.gulp
			.src(src),
		dependencies.load.sourcemaps.init(),
		dependencies.load.sassBulkImport(),
		dependencies.load.sass()
			.on('error', dependencies.functions.swallowError.call),
		dependencies.load.postcss([dependencies.rmHover()])
			.on('error', dependencies.functions.swallowError.call),
		dependencies.load.cleanCss(cleanCssConfig),
		dependencies.load.postcss(postCssPlugins),
		dependencies.load.rucksack(rucksackConfig),
		dependencies.load.concat(concatName),
		dependencies.load.sourcemaps.write('.'),
		dependencies.gulp.dest(dist),
		dependencies.browserSync.stream()
	]);
}
