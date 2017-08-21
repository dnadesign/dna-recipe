<% include Breadcrumbs %>
<div class="pure-g pure-g-padding">
	<% if Menu(2) %>
		<% include SecondaryMenu %>
	<% end_if %>
	<div class="pure-u-1 <% if Menu(2) %>pure-u-md-3-4<% end_if %>">
		<main class="main typography" role="main" id="main">
			<h1 class="page-header">$Title</h1>
			$Content.RichLinks

			<section class="sitemap">
				<ul class="sitemap-list">
					<% if SelectedPage %>
						<% loop SelectedPage.Children %>
						<li data-pagetype="$ClassName" class="sitemap-item sitemap-item--$ClassName">
							<% include SitemapNode %>
						</li>
						<% end_loop %>
					<% else %>
						<% loop Menu(1) %>
						<li data-pagetype="$ClassName" class="sitemap-item sitemap-item--$ClassName">
							<% include SitemapNode %>
						</li>
						<% end_loop %>
					<% end_if %>
				</ul>
			</section>

			$Form
			<% include RelatedPages %>
			$PageComments
		</main>
		<footer class="contentfooter columns twelve">
			<% include PrintShare %>
			<% include LastEdited %>
		</footer>
	</div>
</div>
