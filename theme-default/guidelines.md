# DNA Frontend coding guidelines

We've turned to a combination of BEM and atomic design. We believe this will enable developers to work together easily and produce consistent, professional, maintainable results for clients. It also means we are able to quickly communicate to contractors what and how we want things done in order to reduce code review and rework time and also improve efficiencies of working on larger front-end team.

*This document will*

* Make it easier to peer review
* Create a better workflow
* Create a shared vocabulary
* Be a useful reference

*Remember*

**"Dream BIG"** Think about all the things that are possible or even not possible yet. Don’t feel restricted by technology when thinking about the possibilities. Think first about desirability before viability and feasibility, the solutions that emerge in the end should overlap with what was viable and feasible.

Never lose site of the end result **”what will provide the best user experience"**. The technology used won't necessarily impact the user but the way the technology is executed will. Be thorough and always think from the users point of view.

## Contents

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

It should be easy to find where styles are coming from.

Only use dashes to seperate Elements from Blocks, Or Modifiers from Elements or Blocks. EG:

	.tilenav-item
	.tilenav-item--large

is better than:

	.tile-nav-item
	.tile-nav-item--large

We shouldn't have multiple elements, or multiple modifiers on a single element/block.

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

Styling based on tags is not advised within components. Use classes instead, and only nest to a level that is needed. Forms can be an exception to this if classes are not able to be added at an appropriate place.

Style tags like ``.header li`` seems harmless at first however it's a bad habit which starts becoming a major pain once components begin nesting.

If an ``\<a\>`` is styled in the outer component, that style will normally flow through to the inner component. However we don't want this to happen. We want each component to be independent. If the css uses a rule like: ``.header a`` then the independence will be lost.

Every CSS rules in a component folder should be styling a classname not a tag. This means component styling will not flow outside the scope of the component.

**5. Keep media queries with context**

Where possible, keep media queries inline with the component code. This acknowledges that each break-point is as important as any other, and makes it easier to build a complete design across the various supported breakpoints.

SASS (using the respond mixin):

	.feature {
		  // Regular styles
		  @respond (some-size) {
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

		.feature {
			// Regular styles
			.ie8 & {
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

For example ``.sidebar-title`` NOT ``.sidebar .title``

Although the latter seems simpler, and you can namespace your css to encapsulate bleed, it still bleeds: If two components have .title, and one of them is nested in another then the outer component's styling for .title will bleed into the inner component's .title.

It also requires 2 levels of nesting, where ``.sidebar-title`` requires only one.


**3. Use multiple classes not single class patterns**

	<a class="btn btn--secondary"></a>

is better than:

	<a class="btn--secondary"></a>

While in the latter the HTML is simpler, it reduces flexibility. We want lots of modifiers in a component to create a range of scenarios. The original example assumes there's only one type of modifier. Once this is not the case the single class pattern breaks.

	<a class="btn btn--secondary btn--large"></a>

is more flexible than:

	<a href="btn--secondary--large"></a>

**4. Create modifiers rather than context styling**

Component modifiers should be highlighted by double dashes. Whereas component elements should be denoted with single dashes.

	<a class="btn btn—-secondary btn—-large">
		<span class="btn-arrow">&nbsp;</span>
	</a>

Pages or page types are not components. Do not put classes on the body element, section or similar in order to style a page. This approach should only be used in rare circumstances. A page is not a css component.

Context styling is not a good approach. If a component looks different on a specific page type, create a css class that explains that difference, and add it to the component.

Good:

	.component.component--larger

Bad:

	.homepage .component
	.footer .component


When a component is nested inside another it's tempting to style that component based on context, e.g. .products .btn. This makes code very hard to comprehend, as one component is dependant on another component folder to style it correctly. In this situation, when possible, create a new modifier for the component in the original component folder. For example .btn.btn__products

**5. Make CSS contained**

CSS bleed is one of the most confusing parts of managing a large project. When you depend on styles coming from a range of sources it gets very tricky to debug and continue to develop more CSS.

We want the components we've created to exist with as little dependancies as possible. They should inherit the global tag styles but define everything else themselves. Global styles are typically defined on tags, rather than classes (h1, p etc) Everything else should be contained within a component.

Nesting components will happen so we need to make sure that the outer component doesn't needlessly effect the inner component's style.

### Make CSS consistent

Having consistent rules which each developer abides by means that teams can quickly scale without introducing confusion about how a component works.

**1. Use Mixins sparingly - know when to use components.**

Mixins can bloat the CSS, consider carefully when you use them. Often a component will be a better option. Autoprefixer will handle browser compatibility for you.

A good way to decide between using a mixin, or using a component is whether the mixin would have a variable passed to it. Mixins without variables would be better as components.

**2. Use nesting sparingly.**

If using a css preprocessor don't nest more the 3 times if possible. This simplifies resulting css rules and makes specificity easier. It also makes it easier to reuse the parts of a component, or restructure the html of a component at a later stage. You can use this nested syntax to organise your sass without unintentionally nesting:

	.block {
		&-element {
			/* styles */
		}
	}

this will compile as:

	.block-element { /* styles */}

If you wouldn’t write it in css, don’t let it output that way when using a preprocessor (or a postprocessor).

**3. Follow the style guidelines used in the project**

If you are using a css framework, mimic the framework where possible. If you are working on a project that exists already, follow the general style guidelines that project has followed in regards to spaces vs tabs, camelCase vs underscore vs hyphen et al. Otherwise, try to follow this guide as much as possible.

**4. Class names should contain only hyphens, no underscores or camelCase**

This is our current convention. So long as the css is consistently the same, the separator doesn’t matter. If you have a framework, use the same style of selector used there.

### Frameworks

Work with your framework, not against it. If you are new to the framework, take a look around and find out what it can do. Try to use the components within a framework before creating your own. Even if you know a framework well, always look at it again before making your own component - it might do something that could do half the work for you. Where possible, copy the style conventions of the framework you are using. Try to keep changes to the original framework to a minimum. Removing styles not needed is ok, but any theming should be done within your own component files.

Deciding upon a framework is up to the team and depends on the best interest of the client and the users. Think about maintainability for the long term. How easy it is for other developers outside of your team to become productive when dealing with the code? Is the framework well documented?

Below are some of the framework and libraries we've used on multiple projects and found to be robust accesible and easy to use.

#### Grids: PureCSS
PureCSS grids can be customised to as many columns as required and also handles a different number of columns per breakpoint if this is required, i.e 3 cols at mobile, 7 at tablet, 13 at desktop.


#### Accessible component libraries
This library is very good, and has a focus on accessibility first:
http://whatsock.com/bootstrap/

It includes:
* Accordions
* Banners
* Datepickers (Calendars)
* Carousels
* Menus
* Modals
* Popups
* Scrolls (Scrollable divs),
* Slideshows
* Tabs
* Toggles
* Tooltips
* Trees

It looks minimal out of the box, but will easily adapt to a wide range of designs.

#### Styled selects: Select2
We've tried a bunch of stlyed selects including our own, bootstrap and a couple of others. Select2 has easily the best accessibility (though it is still flawed) and has a wide range of functionality like typeahead, ajax and MVC JS integration which means that while it's not small we can throw it at many different problems and projects and it handles it easily.

#### Tooltips: Bootstrap Tooltips
While we don't use much of bootstrap their tooltip functionality is very good, accessible and easy to implement.

#### Sliders: Slick
Slick handles mobile and touch events well, is easy to implement and works well with our overall structure.

#### Lightboxes: Photoswipe
Photoswipe integrates easily and has an excellent toolset to easily handle image lightboxes (including lightbox slider functionality)


## HTML and Templates

### General

1. **Build for accessibility first** The design is important, but please don't sacrifice accessibility to achieve it. Its much easier to build accessible than it is to make something accessible after the design has been applied.
2. Use html5 versions of html tags whenever it is reasonable to do so. They provide better semantic information than older html
3. Always validate your html.
4. Always think of the worst case user. Would you be happy using this site if you were them? Would it make sense to someone who has never used it before?
5. The first H1 attribute on a page should be the page title. If it isn't in the design, use a screen reader accessible hiding technique (e.g. `.sr-only`)
6. Use aria and role attributes where applicable. Never use images for text. Design comes second to accessibility, but in most cases there should be an acceptable compromise.
7. Use data attributes if you want to feed information to javascript. They are more specific than classes, and more powerful. If you must use a class, use a `js` prefix. eg: '.js-toggle'
8. Don’t use images for design attributes in your html if it can be done with css.
9. Avoid inline styles. There are two exceptions:

	1. Javascript: If you write it yourself, try to add and remove classes instead of using inline styles. Sometimes this isn’t an option. Remember to clean-up inline styles once you are done with them.

	2. CMS editable images or css. Use as little as it takes to produce the result you need. If the CMS is providing a background image, only specify the background-image in the inline style. Leave other background attributes to the css.

### Structure

**Use as few html tags as possible.**

Your html shouldn’t exist just to serve design features. Sometimes this is unavoidable, but if you keep this rule in mind your html will come out cleaner.

**Code re-use**

Use a DRY (Don’t repeat yourself) technique. If you have used the same code blocks on more than one page, use an include. If it’s slightly different, think about whether you could pass an extra class to the include:

	<% include Tiles Modifier=threebythree %>
	<% include Tiles Modifier=twobytwo %>

then in Tile.ss:

	<div class="tiles tiles--$Modifier”></div>

Use component files. If something can be pulled out into a non page specific component, make it an include. **Name the file to match the component name, and use css classes to match** eg:

	TileNav.ss
	_tilenav.scss
	.tilenav {
	  //styles for this component
	}

This will make it easier to recognise which template files match which scss files.

## Style guidelines

* { on same line as selector (with a space between)
* Properties on new line, even if it's a single property.
* 1 line between rules
* JS files that aren't minified should be *.js (or *.src.js) and minified should be *.min.js
* Comment scss component files to say what the component is and examples of where it is used. Always add styleguide doc blocks if you are working with a styleguide.
* Unless there is a reason to do otherwise, @extends come first, @mixins go next (with the exception of @respond), then attribute styles. Attribute modifiers (including responsive) go after attribute styles. Nested attributes go after attribute modifiers

* Recommended (but should not fail peer review) *

* Space between rule and brace (.asd { NOT .asd{)
* Properties in alphabetical order. This helps reduce the chance of double declaring a property and helps readability.
* Space between property and value colon ("display: none" NOT "display:none")

## Project setup

### Folder structure

	themes/
	  default/
		build/
			js/
				components/
			lib/
			sass/
				components/
			forms/
			layout/
			typography/
			ui-kit/
			utilities/
			style.scss
		css/
		fonts/
		images/
			svg/
		js/
		templates/

### Testing

* [http://www.webpagetest.org/](http://www.webpagetest.org/)
* [http://validator.w3.org/](http://validator.w3.org/)
* [http://wave.webaim.org/](http://wave.webaim.org/)
* [https://addons.mozilla.org/en-US/firefox/addon/accessibility-evaluation-toolb/](https://addons.mozilla.org/en-US/firefox/addon/accessibility-evaluation-toolb/)
* [http://www.totalvalidator.com/](http://www.totalvalidator.com/)
