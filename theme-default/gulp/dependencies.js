class Dependencies {
	constructor() {
		this.gulp = require('gulp');
		this.load = require('gulp-load-plugins')();
		this.gulpif = require('gulp-if');
		this.gutil = require('gulp-util');
		this.fs = require('fs');
		this.del = require('del');
		this.autoprefixer = require('autoprefixer');
		this.browserSync = require('browser-sync').create();
		this.rmHover = require('postcss-hover');
		this.inlinesvg = require('postcss-inline-svg');
		this.pump = require('pump');
		this.config = require('./config.json');
		this.functions = require('require-dir')('./functions', { recurse: true });
	}
}

export default (new Dependencies());
