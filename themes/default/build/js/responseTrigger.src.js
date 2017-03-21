var breakpointsConfig = <%= breakpoints %>;

DO.Subscribe('app:ready', function(e, $) {
	$(window).data('breakpoints', getBreakpoints(breakpointsConfig));

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

			if(!/md$/.test(from) && /md$/.test(breakpoint)) {
				DO.Fire('app:breakpointchangetodesktop');
			}

			if(/md$/.test(from) && !/md$/.test(breakpoint)) {
				DO.Fire('app:breakpointchangetomobile');
			}

			if(!/base$/.test(from) && /base$/.test(breakpoint)) {
				DO.Fire('app:breakpointchangetoextrasmall');
			}

			if(!/sm$/.test(from) && /sm$/.test(breakpoint)) {
				DO.Fire('app:breakpointchangetosmall');
			}
		}
	});

	function getBreakpoints(breakpointsConfig) {
		var breakpointList = breakpointsConfig.breakpoints,
			breakpoints = [],
			labels = [],
			number,
			i = 0;

		for(breakpoint in breakpointList) {
			number = parseInt(breakpointList[breakpoint], 10);
			breakpoints[i] = breakpointList[breakpoint].indexOf('em') !== -1 ? number * 16 : number; // NOTE: assumes base font size is 16px
			labels[i] = breakpoint;
			i = i + 1;
		}

		return {
			x: breakpoints,
			labels: labels
		};
	}
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
