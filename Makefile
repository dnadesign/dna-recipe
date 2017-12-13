gulpbin := ./node_modules/gulp/bin/gulp.js

list:
	@echo "Available commands:"
	@grep "^[^#[:space:]].*:$$" Makefile | sort

setup:
	@composer install
	@./framework/sake dev/build "flush=1"
	@cd theme-default && npm install

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
