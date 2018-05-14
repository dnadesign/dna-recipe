<% include Components/Breadcrumbs %>
<div class="pure-g pure-g-padding">
	<div class="pure-u-1 pure-u-md-1-4">
		<div class="filter update-information">
			<h2 class="sr-only">Event information</h2>
			<% include UpdateInfo %>
		</div>
	</div>
	<div class="pure-u-1 pure-u-md-3-4">
		<main id="main" class="main" role="main">
			<h1 class="page-header">$Title</h1>
			$Content.RichLinks

			<% include RelatedPages %>
			$PageComments
		</main>
		<% include ContentFooter %>
	</div>
</div>
