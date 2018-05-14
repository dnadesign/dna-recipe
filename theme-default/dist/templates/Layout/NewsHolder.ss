<% include Components/Breadcrumbs %>
<div class="pure-g pure-g-padding">
	<div class="pure-u-1 pure-u-md-1-4">
		<% include Filter %>
	</div>
	<div class="pure-u-1 pure-u-md-3-4">
		<main id="main" class="results typography" role="main">
			<h1 class="page-header">$Title <% if FilteredUpdates %>
			<% if FilterDescription %>
				<a class="pure-button pure-button--default pure-button--with-heading" href="$Link" role="button"><i class="icon-close"></i>
					Remove filter
				</a>
			<% end_if %>
			<% end_if %></h1>

			<div class="content">
				$Content.RichLinks
			</div>

			<% include MonthFilter %>
			<% include ResultsHeader %>

			<% if FilteredUpdates %>
				<% loop FilteredUpdates %>
					<article class="results-item--{$EvenOdd} results-item results-item--$FirstLast <% if $First %>clearfix<% end_if %>">
						<% include NewsItem %>
					</article>
				<% end_loop %>

				<% with FilteredUpdates %>
					<%  include Components/Pagination %>
				<% end_with %>
			<% else %>
				<article class="results-item--odd results-item--first clearfix">
					<p>No news</p>
				</article>
			<% end_if %>

			$Form
			<% include RelatedPages %>
			$PageComments

			<footer class="contentfooter columns twelve">
				<% include PrintShare %>
				<% include UIKit/LastEdited %>
			</footer>
		</main>
	</div>
</div>
