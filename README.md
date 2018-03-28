# Dna Recipe

Includes a collection of useful modules, a starter theme, and the silverstripe [recipe-cms](https://github.com/silverstripe/recipe-cms)

## Requirements
Silverstripe 4. See 3.0 branch for silverstripe 3 support.

## Getting started
_NOTE: assumes you have node setup and gulp installed globally. If not, you should go do those things first_

### Install
To start a project with this recipe use a terminal to run (replace `your-project` with your project's name):

`composer create-project dnadesign/basic-recipe ./your-project dev-master`  
`cd your-project`   
`make setup`  
    
This will: 
* Copy a draft `.env` file in for you (you'll need to update this)
* Install the frontend dependencies & create the built theme in `theme-default/dist`
* Run `composer install` (because this task doubles as a quick setup for future devs on your project)
* Run `composer vendor-expose` to symlink assets into `public`
* Run a `dev/build ?flush`

### Recipe options

To add this recipe to an existing project:

(optional) `composer require dnadesign/basic-recipe ./your-project dev-master`

To move the cms recipe dependencies to your own composer file in order to modify them:

(optional) `composer update-recipe silverstripe/recipe-cms`

More information about recipes and how to work with them is available here: https://github.com/silverstripe/recipe-plugin

## More
See the themes README file for more specific documentation
