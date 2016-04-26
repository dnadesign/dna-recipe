// SITEMAP
jQuery(function($) {
	"use strict";

	function requestAjax(target, self) {
		self.addClass('loading');

		$.ajax({
			url: self.attr('href'),
			data: { ajax: true }
		}).done(function(data) {
			target.html(data);
			self.removeClass('loading');
		});
	}


	function toggleChildren(target, self) {
		self.toggleClass('open');

		if(self.hasClass('open')) {
			target.removeClass('collapse').addClass('collapsed');
			self.attr('aria-expanded', 'true');
			self.children('.linkText').replaceWith('<span class="linkText">Collapse section</span>');
		} else {
			target.removeClass('collapsed').addClass('collapse');
			self.attr('aria-expanded', 'false');
			self.children('.linkText').replaceWith('<span class="linkText">Expand section</span>');
		}
	}


	function attachEvents() {
		$('.sitemap').on('click', '.button', function() {
			var self = $(this),
				target = $(self.attr('data-target'));

			// only do an ajax request if the content isn't loaded
			if(target.html().length === 0) {
				requestAjax(target, self);
			}

			toggleChildren(target, self);

			return false;
		});
	}


	function init() {
		attachEvents();
	}

	init();
});
