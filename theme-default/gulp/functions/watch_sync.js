
import dependencies from '../dependencies.js';
export function call(src, dist) {
	dependencies.pump([
		dependencies.gulp.src(src)
			.on('error', dependencies.functions.swallowError.call),
		dependencies.gulp.dest(dist),
		dependencies.browserSync.stream()
	]);
}
