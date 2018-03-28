gulpbin := ./node_modules/gulp/bin/gulp.js
sake := /vendor/silverstripe/framework/sake

list:
	@echo "Available commands:"
	@grep "^[^#[:space:]].*:$$" Makefile | sort

# build is used in initial project builds, after composer create. 
# it can be removed in established projects
build:
	@sake dev/build "flush=1"
	@cd theme-default && npm install && $(gulpbin) build
	@composer vendor-expose
	
setup:
	@composer install
	@sake dev/build "flush=1"
	@cd theme-default && npm install && $(gulpbin)
	@composer vendor-expose

start:
	@NODE_ENV=dev make gulp

gulp:
	cd theme-default && $(gulpbin)

release:
	@NODE_ENV=prod cd theme-default && $(gulpbin) build
	@git add -f --all theme-default/dist/js theme-default/dist/css
	@git commit -m "Checking in built assets"

startsolr:
	@cd fulltextsearch-localsolr/server/ && java -jar start.jar &

test:
	@vendor/bin/phpunit
