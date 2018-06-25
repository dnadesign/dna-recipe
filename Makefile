gulpbin := ./node_modules/gulp/bin/gulp.js
sake := /vendor/silverstripe/framework/sake

list:
	@echo "Available commands:"
	@grep "^[^#[:space:]].*:$$" Makefile | sort

setup:
	@test -f .env || cp .env.example .env
	@cd theme-default && npm install && $(gulpbin) build
	@cd ../
	@composer install && composer vendor-expose
	@sake dev/build "flush=1"
	@echo "---\n\n\n \033[1;35m 💥   Project built! Don't forget to update the .env file \033[0m \n\n"

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

devbuild:
    @sake dev/build "flush=1"