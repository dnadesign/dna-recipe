# DNA Basic Recipe.

## Getting started
_NOTE: assumes you have node setup and gulp installed. If not, you should go do those things first_  

Clone this repo

Using terminal:

	cd your-project
	composer update
	cd themes/default
	npm install
	gulp

Composer dependencies are intentionally not tied to versions, but you should update these to use specific releases before the site you are working on goes live.

## Styleguide

Once you have your silverstripe project setup, the styleguide should be available at:
	http://yourprojectdomain/sg/

Docs for the styleguide are available here: https://github.com/benmanu/silverstripe-styleguide

When you create a new component, please document it in the scss file, as we have in the examples.

## Frontend coding guidelines.
These are currently being drafted and will be available once completed. For now:


1. Use BEM principles
2. Keep files modular and namespaced. eg, when creating a header component you may have 3 files:  

	``Menu.ss``

	``menu.src.js ``

	``_menu.scss``

3. Use hyphens not underscores e.g:

	``.block-component--modifier``

	``.menu-link--dark``

4. Shallow nesting and low dependence on mixins (some are ok, but make sure you need a mixin before you make one).

4. Trump card: always follow the style of the codebase or frontend framework you are working with.
