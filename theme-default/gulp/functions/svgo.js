import dependencies from '../dependencies.js';

export function call(src, dist) {
	dependencies.pump([
		dependencies.gulp
			.src(src),
		dependencies.load.svgmin()
			.on('error', dependencies.functions.swallowError.call),
		dependencies.gulp.dest(dist)
	]);
}
