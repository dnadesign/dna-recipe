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

# Using this recipe 

This code comes bundled with a makefile for quick access to common tasks. Run `make list` or `make help` to get a list of available options, or open the [Makefile](Makefile) directly.

## Theme
Theme-default is a starter theme, intended to be used as a base for development. See the [theme README file](theme-default/README.md) for theme specific documentation

## Testing and deployment

This recipe comes with setup for a deployment pipeline from CodeShip to Silverstripe Dashboards. There are commands in the MakeFile for this purpose. 

If you don't intend to use this pipeline, feel free to remove these from the makefile.  Note that by default we aren't committing built assets, so if you have a git based deployment pipeline, you might want to remove `theme-default/dist` from `.gitignore`


### Prerequisites
* A Codeship account
* A SilverStripe Dashboard Project, and a Dashboard api key
* An amazon s3 bucket 

Note: you can still use Codeship and not deploy to platform. 

### Setup

1. Update the `pipeline_project_name` in the [MakeFile](Makefile) with the project name used in the Silverstripe Dashboard. 
2. Codeship: create a new project for this build, and set it up with your projects git details (Codeship supports GitHub, GitLab, and BitBucket repos)

#### CodeShip: Setup your tests

`Codeship > Your project > Project settings > Test`

#####  Setup commands
1. Update the php version to support your project. eg: `phpenv local 7.2`
2. Adjust any other settings you might need (e.g. you can set memory limits with: `echo "memory_limit = 512M" >> $HOME/.phpenv/versions/7.2/etc/php.ini` )
3. Call `make pipeline_setuptest` to set up an instance of your project for tests to run inside

##### Configure Test Pipelines
1. Create a test pipeline
2. Call the `make test` command to run all your project's tests
3. Save your changes

#### Codeship: setup for deployments

##### Configuration
Configure your Codeship environment variables under `Project settings > Environment`. You will need:   
  `AWS_DEFAULT_REGION` - from your bitbucket account. e.g. ap-southeast-2  
  `AWS_ACCESS_KEY_ID`  - from your bitbucket account.  
  `AWS_SECRET_ACCESS_KEY`  - from your bitbucket account.  
  `DASHBOARD_TOKEN` - You can find this in your profile on the Silverstripe Dashboard  
  `DASHBOARD_USER` - this is the email address you use on the dashboard, and not your username  

Note: The AWS connections might be adapted for deployments to other environments, if you aren't hosted on CWP, or the Silverstripe Platform.   

##### Deployment
`Project settings > Deploy`

1. Add a new deployment pipeline, and choose a deployment branch
2. Choose "Custom script" 
3. Call `make pipeline_deploy`. This will prep the test build - removing unwanted files, create a tar file, and send it to a SilverStripe Dashboard for deployment. 

You should now be able to push to your deployment branch to trigger a deploy

