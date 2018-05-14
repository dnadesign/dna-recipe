import dependencies from '../dependencies.js';

export function call(src, dist) {
	dependencies.pump([
		dependencies.gulp
			.src(src),
		dependencies.load.postcss([dependencies.rmHover()])
			.on('error', dependencies.functions.swallowError.call),
		dependencies.load.concat('pure.css'),
		dependencies.load.rename({ suffix: '.src' }),
		dependencies.gulp.dest(dist)
	]);
}
