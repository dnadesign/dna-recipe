import dependencies from '../dependencies.js';
export function call(path, defaultConfig) {
	if (dependencies.browserSync.active) {
		return;
	}
	let bsConfig;
	if (dependencies.fs.existsSync(path)) {
		browserSyncEnvInit(path, bsConfig, defaultConfig);
	} else { // Init with defaultConfig
		dependencies.browserSync.init(defaultConfig);
	}
}

const browserSyncEnvInit = (path, bsConfig, defaultConfig) => {
	dependencies.fs.readFile(path, 'utf8', function (err, data) {
		if (err) {
			return console.log(err);
		}
		data = JSON.parse(data);

		// check for project specific config options
		data = data[project] || data;

		if ((bsConfig = data.browserSync)) {
			if (bsconfig.project.disabled === true) {
				console.log('browsersync disabled');
				return;
			}

			dependencies.browserSync.init(Object.assign({}, defaultConfig, bsConfig));
		}
	});
};
