<% include Breadcrumbs %>
<div class="pure-g">
	<% if Menu(2) %>
		<% include SecondaryMenu %>
	<% end_if %>
	<div class="pure-u-1 <% if Menu(2) %>pure-u-md-3-4<% end_if %>">
		<div class="main typography" role="main" id="main">
			<h1 class="page-header">$Title</h1>
			$Content.RichLinks
			$Form
			<% include RelatedPages %>
			$PageComments
		</div>
		<% include ContentFooter %>
	</div>
</div>
