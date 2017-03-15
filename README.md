## Getting started
_NOTE: assumes you have node setup and gulp installed. If not, you should go do those things first_

Clone this repo

Using terminal:

	cd your-project
	composer update
	cd themes/default
	npm install
	gulp

Composer dependencies are intentionally not tied to versions, but you should update these to use specific releases before the site you are working on goes live

## Theme
The default theme uses:
* Sass: http://sass-lang.com/
* Gulp: http://gulpjs.com/
* Postcss + autoprefixer: This means we don't need to worry about browser prefixes in our own css. Autoprefixer will add these for us. http://postcss.org/
* Rucksack: "PostCSS CSS super powers library":  http://simplaio.github.io/rucksack/ This lets us do things like clear: fix;
* The PureCSS micro framework: http://purecss.io/ This is included via npm and a gulp task. If your project requires a more fully featured framework, just remove the references to pure.

Basic templates are provided, based on CWP templates using pure as a framework. Delete what you don't need.

## Styleguide

Once you have your silverstripe project setup, the styleguide should be available at:
	http://yourprojectdomain/sg/

Docs for the styleguide are available here: https://github.com/benmanu/silverstripe-styleguide

When you create a new component, please document it in the scss file, as we have in the examples.

## Custom breakpoints

It is recommended you work with the default grid where possible, but sometimes the 5 and 24 grid may not be enough. In this situation you can add extra grids using the rework plugin. You can find  [instructions here](themes/default/README.md)



## Frontend coding guidelines

We've turned to a combination of BEM and atomic design. We believe this will enable developers to work together easily and produce consistent, professional, maintainable results for clients. It also means we are able to quickly communicate to contractors what and how we want things done in order to reduce code review and rework time and also improve efficiencies of working on larger front-end team.

*This document will*

* Make it easier to peer review
* Create a better workflow
* Create a shared vocabulary
* Be a useful reference

*Remember*

**"Dream BIG"** Think about all the things that are possible or even not possible yet. Don’t feel restricted by technology when thinking about the possibilities. Think first about desirability before viability and feasibility, the solutions that emerge in the end should overlap with what was viable and feasible.

Never lose site of the end result **”what will provide the best user experience"**. The technology used won't necessarily impact the user but the way the technology is executed will. Be thorough and always think from the users point of view.

##Contents

* [CSS and SASS](#css-and-sass)
 * [Make CSS manageable](#make-css-manageable)
 * [Make CSS modular](#make-css-modular)
 * [Make CSS consistent](#make-css-consistent)
 * [Frameworks](#frameworks)
* [HTML and Templates](#html-and-templates)
 * [General](#general)
 * [Structure](#structure)
* [Style Guidelines](#style-guidelines)
* [Project Setup](#project-setup)

## CSS and SASS

THREE GUIDING PRINCIPLES FOR CSS

1. Make it manageable
2. Make it modular
3. Make it consistent

### Make CSS manageable

**1. Don’t use !important or IDs in your CSS**

IDs are fine for javascript and html. They are not for styling. Overriding IDs with classes is almost impossible (256 to override in most browsers), which severely limits the use of modular components and modular design philosophy.

Never use !important.  If you do need to use !important (eg: for a javascript override where there is no other option), comment it well and make sure the path is specific to just the place you need it.

Remember that you as a developer may not think of every possible future use of the site, and the use of either !important or an ID could make future changes harder to implement. If the html does not have the classes you require, add them.

**2. Use classes appropriately**

You should be able to look at a classname and see 2 things: the component it belongs to, and its function:

	<ul class="menu">
	  <li class="menu-item">…</li>
	  <li class="menu-item">…</li>
	</ul>

It should be easy to find where styles are coming from. You should then be able to open one main file in order to edit component styles.

**3. CSS should not rely on page structure**

Never write css that looks like this:

	section {
	  section {
		article {
		  .item { }
		}
	  }
	}


The number of surrounding base tags should not matter, and without extensive commenting no one will understand your reasoning for this (including yourself in two years’ time). Any change to the html of a page will break the design.

**4. Avoid tag styling**

Styling based on tags is not advised where possible. Use classes on tags instead, and only nest to a level that is needed. Forms can be an exception to this if classes are not able to be added at an appropriate place.

Style tags like .header li seems harmless at first however it's a bad habit which starts becoming a major pain once components begin nesting.

If an \<a\> is styled in the outer component, that style will normally flow through to the inner component. However we don't want this to happen. We want each component to be independent. If the css uses a rule like: .header a then the independence will be lost.

Every CSS rules in a component folder should be styling a classname not a tag. This means components will not affect each others styling in any way.

**5. Keep media queries with context**

Where possible, keep media queries inline with the component code. This acknowledges that each break-point is as important as any other, and makes it easier to build a complete design across the various supported breakpoints.

SASS:

	.feature{
		  // Regular styles
		  @media (some-size){
			  // media specific overrides for .feature
		}
	}

**6. Class based browser hacks with original context**
Use class based IE overrides, and keep the IE overrides inline with the component code. This makes it easier to maintain IE css when a feature is changed.

HTML:

	<!--[if lte IE 6 ]><html class="no-js ie6 oldie" lang="$ContentLocale" id="ie6"><![endif]-->
	<!--[if IE 7 ]><html class="no-js ie7 oldie" lang="$ContentLocale" id="ie7"><![endif]-->
	<!--[if IE 8 ]><html class="no-js ie8 oldie" lang="$ContentLocale" id="ie8"><![endif]-->
	<!--[if IE 9]><html class="no-js ie9" id="ie9" lang="en"><![endif]-->
	<!--[if gt IE 9]><!--><html class="no-js" lang="$ContentLocale"><!--<![endif]-->


SASS:

		.feature{
			// Regular styles
			.ie8 &{
				// IE8 specific overrides for .feature
			 }
		}

CSS:

		.feature {}
		.ie8 .feature {}



### Make CSS modular

**1. Split CSS into components**

Components can exist within components. For example header and nav-main may be separate components even though nav-main only occurs in header. Each component name must be unique and descriptive.

*"We’re not designing pages, we’re designing systems of components." — [Stephen Hay](http://bradfrostweb.com/blog/mobile/bdconf-stephen-hay-presents-responsive-design-workflow/) **

The goal of components is easily identifiable, manageable, and reusable code. Management of a component is directly correlated to number of lines, e.g 1000 lines is too much, 500 is pushing it.

While reusing a component across projects seems like a good goal, it's only a bonus. Try not to code with other projects in mind. Components may be used across projects but only as a starting point.

**2. Namespace your component parts.**

Each class within a component must start with the component name.

For example .sidebar .sidebar-title NOT .sidebar .title

Although the latter seems better as it's simpler, and you can namespace your css to encapsulate bleed, it still bleeds.

If two components have .title, and one of them is nested in another then the outer component's styling for .title will bleed into the inner component's .title.

Therefore all classnames inside a component must be prefixed by the component's name, e.g. .sidebar-title NOT .title

**3. Use multiple classes not single class patterns**

	<a class="btn btn-secondary"></a>

is better than:

	<a class="btn-secondary"></a>

While in the latter the HTML is simpler, it reduces flexibility. We want lots of modifiers in a component to create a range of scenarios. The original example assumes there's only one type of modifier. Once this is not the case the single class pattern breaks.

	<a class="btn btn-secondary btn-large"></a>

is better than

	<a href="btn-secondary-large"></a>

**4. Create modifiers rather than context styling**

Component or component part modifiers should be highlighted by double underscores. Whereas component parts should be denoted with single underscores.

	<a class="btn btn—secondary btn—large">
		<span class="btn-arrow">&nbsp;</span>
	</a>

Pages or page types are not components. Do not put classes on the body element, section or similar in order to style a page. This approach should only be used in rare circumstances.

Context styling is not a good approach. If a component looks different on a certain page type, create a css class that explains that difference, and add it to the component.

Good:

	.component.component-larger

Bad:

	.home-page .component
		.footer .component

The .typography class should only be used for typography. If specificity is needed, use a layout based class name (eg .content, .main, or .layout) and leave a comment explaining why the class is there. If possible, only give the specific overrides to the rules that need it (pull them out of any nested sass). This will make it easier to deal with overriding the other styles later, and often prevents an unneeded sass nesting level.

When a component is nested inside another it's tempting to style that component based on context, e.g. .products .btn. This makes code very hard to comprehend, as one component is dependant on another component folder to style it correctly. In this situation create a new modifier for the component in the original component folder. For example .btn.btn__products

**5. Make CSS contained**

CSS bleed is one of the most confusing parts of managing a large project. When you depend styles coming from a range of sources it gets very tricky to debug and continue to develop more CSS.

We want the components we've created to exist with as little dependancies as possible. They should inherit the global tag styles but define everything else themselves. Global styles are typically defined on tags, rather than classes (h1, p etc) Everything else should be contained within a component.

Nesting components will happen so we need to make sure that the outer component doesn't needlessly effect the inner component's style.

### Make CSS consistent

Having consistent rules which each developer abides by means that teams can quickly scale without introducing confusion about how a component works.

**1. Use Mixins sparingly - know when to use @extends or components.**

Mixins can bloat the CSS, consider carefully when you use them. If your mixin is above 5 lines of CSS then it should probably just be a component, or part of a component. Using mixins for rounded-corners, drop-shadows etc is a perfectly good use case.

A good way to decide between using a mixin, or using a placeholder or a component is whether the mixin would have a variable passed to it. Mixins without variables would be better as components or placeholders.

**2. Use nesting sparingly.**

If using a css preprocessor don't nest more the 3 times if possible (max 5!). This simplifies resulting css rules and makes specificity easier. It also makes it easier to reuse the parts of a component, or restructure the html of a component at a later stage.

If you wouldn’t write it in css, don’t let it output that way when using a preprocessor.

**3. Follow the style guidelines used in the project**

If you are using a css framework, mimic the framework where possible. If you are working on a project that exists already, follow the general style guidelines that project has followed in regards to spaces vs tabs, camelCase vs underscore vs hyphen et al. Otherwise, try to follow this guide as much as possible.

**4. Class names should contain only hyphens, no underscores or camelCase**

Just convention. So long as the css is consistently the same, the separator doesn’t matter. If you have a framework, use the same style of selector used there.

### Frameworks

Work with your framework, not against it. If you are new to the framework, take a look around and find out what it can do. Try to use the components within a framework before creating your own. Even if you know a framework well, always look at it again before making your own component - it might do something that could do half the work for you. Where possible, copy the style conventions of the framework you are using. Try to keep changes to the original framework to a minimum. Removing styles not needed is ok, but any theming should be done within your own component files.

Deciding upon a framework is up to the scrum team and depends on the best interest of the client and the users. Think about maintainability for the long term. How easy it is for other developers outside of your scrum team to become productive when dealing with the code? Is the framework well documented?

Below are some of the framework and libraries we've used on mutiple projects and found to be robust accesible and easy to use.

#### Grids: PureCSS
PureCSS grids can be customised to as many columns as required and also handles a different number of columns per breakpoint if this is required, i.e 3 cols at mobile, 7 at tablet, 13 at desktop.

#### Styled selects: Select2
We've tried a bunch of stlyed selects including our own, bootstrap and a couple of others. Select2 has easily the best accessibility and has a wide range of functionality like typeahead, ajax and MVC JS integration which means that while it's not small we can throw it at many different problems and projects and it handles it easily.

#### Modals: ??

#### Tooltips: Bootstrap Tooltips
While we don't use much of bootstrap their tooltip functionality is very good, accessible and easy to implement.

#### Carousels: Slick or Photoswipe
Slick handles mobile and touch events well, is easy to implement and works well with our overall structure.

Photoswipe also integrates easily and has an excelent toolset to easily handle image popups.

#### Date picker: Jquery UI
It's old school but it works well.

## HTML and Templates

### General

1. Use html5 versions of html tags whenever it is reasonable to do so. They provide better semantic information than older html
2. Always validate your html.
3. Always think of the worst case user. Would you be happy using this site if you were them? Would it make sense to someone who has never used it before?
4. The first H1 attribute on a page should be the page title. If it isn't in the design, use a screen reader accessible hiding technique
5. Use aria and role attributes where applicable. Never use images for text. Design comes second to accessibility, but in most cases there should be an acceptable compromise.
6. Use $FirstLast if only the first and last items in a loop need to be styled. This is more semantic than giving each loop item a unique class.
7. Use data attributes if you want to feed information to javascript. They are easier than classes, and more specific.
8. Don’t use images for design attributes in your html if it can be done with css.
9. Avoid inline styles. There are two exceptions:

	1. Javascript: If you write it yourself, try to add and remove classes instead of using inline styles. Sometimes this isn’t an option. Remember to clean-up inline styles once you are done with them.

	2. CMS editable images or css. Use as little as it takes to produce the result you need. If the CMS is providing a background image, only specify the background-image in the inline style. Leave other background attributes to the css.

### Structure

**Use as few html tags as possible.**

Your html shouldn’t exist just to serve design features. Sometimes this is unavoidable, but if you keep this rule in mind your html will come out cleaner.

**Code re-use**

Use a DRY (Don’t repeat yourself) technique. If you have used the same code blocks on more than one page, use an include. If it’s slightly different, think about whether you could pass an extra class to the include:

	<% include Tiles Context=three-by-three %>
	<% include Tiles Context=two-by-two %>

then in Tile.ss:

	<div class="tiles $Context”></div>

Use component files. If something can be pulled out into a non page specific component, make it an include. Name the file to match the component name, and use css classes to match eg:

	TileNav.ss
	_tile-nav.scss
	.tile-nav {
	  //styles for this component
	}

This will make it easier to recognise which template files match which scss files.

## Style guidelines

* { on same line as selector
* Properties on new line, even if it's a single property.
* 1 line between rules
* JS files that aren't minified should be *.js and minified should be *.min.js
* Comment scss component files to say what the component is and examples of where it is used
* Unless there is a reason to do otherwise, @extends come first, @mixins go next, then attribute styles. Attribute modifiers (including responsive) go after attribute styles. Nested attributes go after attribute modifiers

*Recommended (but should not fail peer review)*

* Space between rule and brace (.asd { NOT .asd{)
* Properties in alphabetical order. This helps reduce the chance of double declaring a property and helps readability.
* Space between property and value colon ("display: none" NOT "display:none")

## Project setup

### Folder structure

	themes/
	  theme-name/
		build/
		css/
		fonts/
		images/
		js/
		templates/

### Testing

* [http://www.webpagetest.org/](http://www.webpagetest.org/)
* [http://validator.w3.org/](http://validator.w3.org/)
* [http://wave.webaim.org/](http://wave.webaim.org/)
* [https://addons.mozilla.org/en-US/firefox/addon/accessibility-evaluation-toolb/](https://addons.mozilla.org/en-US/firefox/addon/accessibility-evaluation-toolb/)
* [http://www.totalvalidator.com/](http://www.totalvalidator.com/)
