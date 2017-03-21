# DNA Sass boilerplate.

Documentation available in the [project root](../../README.md)


## Custom breakpoints

It is recommended you work with the default grid where possible, but sometimes the 5 and 24 grid may not be enough. In this situation you can add extra grids using the rework plugin. `npm install rework rework-pure-grids` then include this in your gulpfile:

	var gulp = require('gulp'),
		pureGrids = require('rework-pure-grids'),
		rework = require('gulp-rework'),		

and

	function getMediaQueries() {
		var path='js/src/var-breakpoints.json',
			mediaQueries = {};

		// Read breakpoints and generate mediaQueries object for rework
		if (fs.existsSync(path)) {
			file = fs.readFile(path, 'utf8', function (err,data) {

				if (err) {
					return console.log(err);
				}

				data = JSON.parse(data);

				for (var k in data.breakpoints) {
					mediaQueries[k] = "screen and (min-width:" + data.breakpoints[k] + ")";
				}
			});
		}

		return mediaQueries;
	}

then you can call this from the pure function in gulp. eg:

	return gulp.src([
		'node_modules/purecss/build/pure.css',
		'node_modules/purecss/build/grids-responsive.css'
		])
		.pipe(rework(pureGrids.units({ mediaQueries: getMediaQueries() })))


At this stage you will still need to manually edit the push-pull classes to add your new breakpoints.
