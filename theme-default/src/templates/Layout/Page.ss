<% include Components/Breadcrumbs %>
<div class="pure-g">
	<% if Menu(2) %>
		<% include Components/SecondaryMenu  %>
	<% end_if %>
	<div class="pure-u-1 <% if Menu(2) %>pure-u-md-3-4<% end_if %>">
		<main class="main typography" role="main" id="main">
			<h1 class="page-header">$Title</h1>
			$Content.RichLinks
			$Form
			<% include RelatedPages %>
			$PageComments
		</main>
		<% include ContentFooter %>
	</div>
</div>
