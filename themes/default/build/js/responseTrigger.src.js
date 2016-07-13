$(window).data('breakpoints', {
	x: [0, 568, 768, 1024, 1280]
});

DO.Subscribe('app:ready', function(e, $) {

	var html = $('html'),
		breakpoint = DO.CurrentBreakpoint();

	Response.create({
		mode: 'src',
		prefix: 'src',
		breakpoints: $(window).data('breakpoints').x
	});

	Response.action(function() {
		if(DO.CurrentBreakpoint() !== breakpoint) {
			DO.Fire('app:breakpointchange');

			var from = breakpoint;
			breakpoint = DO.CurrentBreakpoint();

			if(!/medium$/.test(from) && /medium$/.test(breakpoint)) {
				DO.Fire('app:breakpointchangetodesktop');
			}

			if(/medium$/.test(from) && !/medium$/.test(breakpoint)) {
				DO.Fire('app:breakpointchangetomobile');
			}

			if(!/base$/.test(from) && /base$/.test(breakpoint)) {
				DO.Fire('app:breakpointchangetoextrasmall');
			}

			if(!/small$/.test(from) && /small$/.test(breakpoint)) {
				DO.Fire('app:breakpointchangetosmall');
			}
		}
	});

});

DO.Subscribe('ajax:success', function(e, $) {
	Response.create({
		mode: 'src',
		prefix: 'src',
		breakpoints: $(window).data('breakpoints').x
	});
});

DO.Subscribe(['app:breakpointchange', 'app:ready'], function(e, $) {
	var html = $("html");

	html.attr('class',
		html.attr('class')
			.replace(/response_[\w]*(\s|\w$)/g, '')
			.replace(/[\s]+/g, ' ')
	);

	html.addClass('response_'+ DO.CurrentBreakpoint());
});
