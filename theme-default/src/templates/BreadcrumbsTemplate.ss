<% if Pages %>
	<ol class="breadcrumbs-list">
		<li class="breadcrumbs-item">
			<a class="breadcrumbs-link" href="$Baseref">Home</a>
		</li>

		<% loop $Pages %>
			<% if $Last %>
				<li class="breadcrumbs-item breadcrumbs-item--current">$Title.XML</li>
			<% else %>
				<li class="breadcrumbs-item">
					<a class="breadcrumbs-link" href="$Link">$MenuTitle.XML</a>
				</li>
			<% end_if %>
		<% end_loop %>
	</ol>
<% end_if %>
