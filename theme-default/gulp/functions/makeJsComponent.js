import dependencies from '../dependencies.js';
export function call(param, configs) {
	const eslintConfig = {
		globals: ['jQuery', 'console', 'document', 'DO'],
		envs: ['browser']
	};
	let templateConfig = {};
	if (configs.template.enabled) {
		const configJSON = dependencies.fs.readFileSync(configs.template.src);
		templateConfig = JSON.parse(configJSON);
	}
	dependencies.pump([
		dependencies.gulp
			.src(param.src),
		dependencies.load.if(configs.template.enabled, dependencies.load.template({ breakpoints: JSON.stringify(templateConfig) })
			.on('error', dependencies.functions.swallowError.call)),
		dependencies.load.if(configs.eslint, dependencies.load.eslint(eslintConfig)),
		dependencies.load.if(configs.eslint, dependencies.load.eslint.format()),
		dependencies.load.if(configs.sourcemaps, dependencies.load.sourcemaps.init().on('error', dependencies.functions.swallowError.call)),
		dependencies.load.if(configs.babel, dependencies.load.babel().on('error', dependencies.functions.swallowError.call)),
		dependencies.load.concat(param.concatName),
		dependencies.load.if(configs.sourcemaps, dependencies.load.sourcemaps.write('.')),
		dependencies.gulp.dest(param.dist),
		dependencies.load.if(configs.uglify && process.env.NODE_ENV !== 'dev', dependencies.load.uglify().on('error', dependencies.functions.swallowError.call)),
		dependencies.load.if(configs.rename.enabled, dependencies.load.rename({
			suffix: configs.rename.suffix
		})),
		dependencies.gulp.dest(param.dist),
		dependencies.load.if(configs.sync, dependencies.browserSync.stream())
	]);
}
