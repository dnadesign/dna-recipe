list:
	@echo "Available commands:"
	@grep "^[^#[:space:]].*:$$" Makefile | sort

setup:
	@composer install
	@./framework/sake dev/build "flush=1"
	@cd themes/default && npm install

start:
	@cd themes/default && gulp

release:
        @cd themes/default && gulp build
        @git add -f --all themes/default/js themes/default/css
        @git commit -m "Checking in built assets"

startsolr:
        @cd fulltextsearch-localsolr/server/ && java -jar start.jar &
