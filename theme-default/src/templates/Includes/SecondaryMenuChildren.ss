<% loop Children %>
	<li class="$LinkingMode<% if $LinkingMode = current %> active<% end_if %><% if $First %> first<% end_if %><% if $Last %> last<% end_if %>">
		<a href="$Link" class="<% if $LinkingMode = current %>active<% end_if %>">
		$MenuTitle
		</a>
		<% if Children %>
			<% if $LinkingMode = current || $LinkingMode = section %>
				<ul class="nav nav-list">
					<% include SecondaryMenuChildren First=$First, Last=$Last %>
				</ul>
			<% end_if %>
		<% end_if %>
	</li>
<% end_loop %>
