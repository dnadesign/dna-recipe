<ul class="sitemap-list">
	<% loop Children %>
		<% if ShowInMenus %>
			<li data-pagetype="$ClassName" class="sitemap-item sitemap-item--$ClassName">
			<% include SitemapNode %>
			</li>
		<% end_if %>
	<% end_loop %>
</ul>
