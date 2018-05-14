<% if SubNavigation %>
	<nav id="sg-subnav" class="sg-subnav hidden-md--max">
		<ul class="sg-nav">
			<% loop $SubNavigation %>
				<li>
					<a data-target="#{$ReferenceID}" href="#{$ReferenceID}" title="$Title">$Title</a>
					<% if $Modifiers %>
						<ul class="sg-nav">
							<% loop $Modifiers %>
								<li><a data-target="#{$Reference}" href="#{$Reference}" title="$Name">$Name</a></li>
							<% end_loop %>
						</ul>
					<% end_if %>
				</li>
			<% end_loop %>
			<li><a href="#" title="Top"><small><strong>Back to top</strong></small></a></li>
		</ul>
	</nav>
<% end_if %>
