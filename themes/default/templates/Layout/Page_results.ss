<div class="pure-g pure-g-padding">
	<div id="main" class="pure-u-1 results-list" role="main">
		<h1 class="search-query page-header">Search results</h1>


		<% include ResultsHeader %>

		<% if Results %>
			<ol id="search-results" class="search-results results">
				<% loop Results %>
					<li>
						<article class="$EvenOdd item $FirstLast <% if $First %>clearfix<% end_if %>">
							<header>
								<h4><a href="$Link">$Title</a></h4>
							</header>
							<p>
								<% if Abstract %>$Abstract.XML<% else %>$Content.ContextSummary<% end_if %>
							</p>
						</article>
					</li>
				<% end_loop %>
			</ol>

			<% with Results %>
				<% include Pagination %>
			<% end_with %>

		<% else %>
		<article class="odd first clearfix">
			<p>Sorry, your search query did not return any results.</p>
		</article>
		<% end_if %>
	</div>
	<% include ContentFooter %>
</div>
