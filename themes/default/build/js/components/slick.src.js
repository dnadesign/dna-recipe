/**
* Slick slider init
*
*/
DO.Subscribe('app:ready', function(e, $) {
	'use strict';

	function init() {
		setup($(document));
	}

	function setup(scope) {
		if (scope.find('[data-slider]').length < 1) {
			return;
		}

		scope.find('[data-slider]').slick(getConfig());

		attachEvents(scope);
	}

	function attachEvents(scope) {
		if (scope.is(document)) {
			$(document).on('ajaxpages:contentloaded', function(e, data) {
				setup(data.target);
			});
		}
	}

	// [0, 568, 768, 1024, 1280]
	function getConfig() {
		return {
			mobileFirst: true,
			variableWidth: true,
			infinite: false,
			slidesToShow: 1,
			arrows: true,
			prevArrow: '<button type="button" class="pure-button pure-button-icononly slick-prev"><span class="sr-only">Previous</span></button>',
			nextArrow: '<button type="button" class="pure-button pure-button-icononly slick-next"><span class="sr-only">Next</span></button>',
			responsive: [{
				breakpoint: 1280,
				settings: {
					slidesToShow: 4
				}
			}, {
				breakpoint: 1024,
				settings: {
					slidesToShow: 3
				}
			}, {
				breakpoint: 600,
				settings: {
					slidesToShow: 3
				}
			}, {
				breakpoint: 480,
				settings: {
					arrows: true,
					slidesToShow: 2
				}
			}]
		};
	}

	init();
});
