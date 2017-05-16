/**
 * Toggles and switches extra js (for accessibility).
 * Uses ../lib/toggles-switches.js from https://github.com/dsurgeons/Toggles-Switches
 */

DO.Subscribe('app:ready', function(e, $) {
	'use strict';

	var focusable = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]',
		focusableNative = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed';

	/**
	 * Initialize Button actions
	 */
	function init() {
		setup($(document));
	}

	/**
	 * Apply setup to our newly loaded area (document, or scope)
	 *
	 * @param scope | DOMObject - the area of the page we are applying this functionality to
	 */
	function setup(scope) {
		// if aria hidden, we shouldn't be able to focus
		scope.find('[aria-hidden="true"]').find(focusable).attr('tabindex', '-1');

		attachEvents(scope);
	}

	/**
	 * If an element has the attribute data-toggle-aria we want to toggle the
	 * aria-hidden attribute of the data-toggle-aria value and the tabindex of
	 * all focusable children.
	 * @param scope | DOMObject
	 */
	function attachAriaHide(scope) {
		var targets = scope.find('[data-toggle-aria]');

		// Set aria hidden and tabindex -1
		targets.on('click', function() {
			var target = $(this).data('toggle-aria'),
				value = $(target).attr('aria-hidden') === 'false' ? 'true' : 'false',
				tabindex = value === 'false' ? '0' : '-1';

			$(target).attr('aria-hidden', value);
			$(target).find(focusable).attr('tabindex', tabindex);
		});
	}

	/**
	 * Attach events
	 * @param scope | DOMObject
	 */
	function attachEvents(scope) {
		attachAriaHide(scope);

		scope.find('[data-contain]').on('click', function(e) {
			e.stopPropagation();
		});

		// make sure we get the order of our events right
		setTimeout(function() {
			keyboardFocus(scope);
		}, 1000);

		if (scope.is(document)) {
			$(document).on('ajaxpages:contentloaded', function(e, data) {
				setup(data.target);
			});
		}
	}

	/**
	 * Allow a focus state that only appears for people using keyboards to navigate
	 * @param scope | DOMObject
	 */
	function keyboardFocus(scope) {
		scope.find(focusable).on('keyup', function(e) {
			$(e.target).addClass('hasfocus');

			if ($(e.target).is(focusableNative)) {
				return;
			}

			// trigger click if this element doesn't usually support click
			if (e.keyCode === 13) {
				e.preventDefault();
				e.stopPropagation();
				$(e.target).trigger('click');
			}
		}).on('blur focusout', function(e) {
			$(e.target).removeClass('hasfocus');
		});
	}

	init();
});
