<% if Menu(2) %>
	<% cached 'menu2', ID, List(Page).max(LastEdited) %>
	<div class="pure-u-1 pure-u-md-1-4">
		<nav class="secondary-menu pure-menu pure-menu-open menu-plain" id="page-nav" role="navigation">
			<h2 class="sr-only">Secondary Navigation</h2>
			<ul class="">
				<% loop Menu(2) %>
					<li class="$LinkingMode<% if $LinkingMode = current %> active<% end_if %><% if $First %> first<% end_if %><% if $Last %> last<% end_if %>">
						<a href="$Link" class="<% if $LinkingMode = current %>active<% end_if %>">
						$MenuTitle
						</a>
						<% if Children %>
							<% if $LinkingMode = current || $LinkingMode = section %>
								<div class="pure-menu pure-menu-open menu-plain-submenu" id="page-nav" role="navigation">
								<ul class="">
									<% include SecondaryMenuChildren First=$First, Last=$Last %>
								</ul>
								</div>
							<% end_if %>
						<% end_if %>
					</li>
				<% end_loop %>
			</ul>
		</nav>
	</div>
	<% end_cached %>
<% end_if %>
