gulpbin := ./node_modules/gulp/bin/gulp.js
sake := @vendor/silverstripe/framework/sake
tape := ../tape
pipeline_project_name := defaultProject  # swap this out for the name of your project on the SilverStripe Dashboard
SRC_DIR := `pwd -P`

list: help ## Get a list of available commands

help: ## Get a list of available commands
	@echo "Available commands:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36mmake %-30s\033[0m %s\n", $$1, $$2}'

setup: ## Run when first setting up this project
	@test -f .env || cp .example.env .env
	@cd theme-default && npm install
	@make gulpbuild && cd ../
	@composer install && composer vendor-expose
	@make devbuild
	@echo "---\n\n\n \033[1;35m 💥   Project built! Don't forget to update your .env file. See Makefile for more commands \033[0m \n\n"

gulp: ## Start gulp watch on the theme-default folder
	@cd theme-default && $(gulpbin)

gulpbuild: ## Install theme-default dependencies & build the theme
	@cd theme-default && npm install && $(gulpbin) build

devbuild: ## Rebuilds Silverstripe database tables/fields, refreshes the manifest, and clears the silverstripe cache
	$(sake) dev/build "flush=1"

flush: ## Flushes the Silverstripe cache
	$(sake) "flush=1"

test: ## Runs all the unit tests for this project
	@vendor/bin/phpunit

iconref: ## displays silverstripe's icon library
	@open vendor/silverstripe/admin/client/src/font/icons-reference.html

# Solr helpers
solr_start: ## For projects using the fulltextsearch-localsolr module, this will start up the solr server.
	@cd fulltextsearch-localsolr/server/ && java -jar start.jar &

solr_conf: ## Configure the solr indexes after schema changes
	$(sake) dev/tasks/Solr_Configure verbose=1

solr_reindex: ## Refresh the solr index
	$(sake) dev/tasks/Solr_Reindex

solr_kill: ## shows command to kill solr
	@echo "\n\nTo kill solr run: \033[1;35m lsof -i tcp:8983 | awk -F ' ' '{print \$$2}' | grep -v PID | xargs kill \033[0m \n\n"


# Testing & Deployment
# The following commands are used for Codeship -> Dashboard deploys (CWP & Silverstripe Platform)
# If you don't intend to use that pipeline, you can remove these
# Note that by default we aren't committing built assets, so if you have a git based
# deployment pipeline, you might want to remove theme-default/dist from .gitignore

pipeline_checkenv: ## Pipelines: Check if this project is inside a CodeShip environment setup for deploys
	if test "${DASHBOARD_TOKEN}" = "" ; then \
		echo "DASHBOARD_TOKEN not set. This task is for Codeship, not local dev"; \
		exit 1; \
	fi

pipeline_test: ## Pipelines: Run tests. Tests can be bypassed if the most recent commit contains SKIP_CI
	$(eval skip := $(findstring SKIP_CI,$(shell echo `git log -1 --pretty='format:%C(auto) %s %b'`)))
	if test $(skip) = SKIP_CI; then \
		echo "Skipping tests"; \
	else \
		make test; \
	fi

pipeline_setuptest: ## Pipelines: Set up an environment for tests to run inside
	@test -f .env || cp .test.env .env
	@composer install --no-interaction --optimize-autoloader
	@make gulpbuild
	@composer vendor-expose
	@make devbuild

pipeline_deploy: ## Pipelines: Preps test build for deploy, & sends a tar file to a silverstripe dashboard (uat by default)
	@make pipeline_checkenv
	@composer install --no-interaction --no-dev --optimize-autoloader
	@rm .env && rm -rf .git && rm -rf ./**/node_modules && rm -rf log/
	$(eval deployTitle := $(shell echo `git log -1 --pretty='format:%C(auto) %s'`))
	$(eval deployID = ${CI_COMMIT_ID})
	@cd ../
	@curl -sS -L -f https://github.com/stojg/tape/releases/download/1.4.0/tape_linux_1.4.0 -o $(tape) && chmod +x $(tape)
	$(tape) --title "$(deployTitle) ($(deployID))" $(SRC_DIR) s3://dna-deployments/$(pipeline_project_name)-$(deployID).tgz https://dash.cwp.govt.nz/naut/project/$(pipeline_project_name)/environment/uat
