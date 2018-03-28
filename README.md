# Dna Recipe

Includes a collection of useful modules, a [starter theme](https://github.com/dnadesign/dna-recipe-theme-default), and the silverstripe [recipe-cms](https://github.com/silverstripe/recipe-cms)

## Requirements
Silverstripe 4. See 3.0 branch for silverstripe 3 support.

## Getting started
_NOTE: assumes you have node setup and gulp installed. If not, you should go do those things first_

### Install
To start a project with this recipe run:

`composer create-project dnadesign/basic-recipe ./your-project dev-master`

to move the cms recipe dep to your own composer file in order to modify them use:

(optional) `composer update-recipe silverstripe/recipe-cms`

To add this recipe to an existing project:

(optional) `composer require dnadesign/basic-recipe ./your-project dev-master`

and then run update-recipe as above if you wish to inline it.

More information about recipes and how to work with them is available here: https://github.com/silverstripe/recipe-plugin

### Post install
1. Copy in a .env file, or rename the .env.example file. 
2. Update gulp with your project name details

3. Using terminal either:

    make setup

or

    cd your-project/theme-default
    npm install
    gulp
    
See the themes README file for more specific documentation

See also: https://github.com/dnadesign/dna-recipe-theme-default
