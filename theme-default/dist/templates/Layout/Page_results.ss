<div class="pure-g pure-g-padding">
	<main id="main" class="pure-u-1 results" role="main">
		<h1 class="search-query page-header">Search results</h1>


		<% include ResultsHeader %>

		<% if Results %>
			<ol id="search-results" class="results-list">
				<% loop Results %>
					<li>
						<article class="results-item--$EvenOdd results-item results-item--$FirstLast <% if $First %>clearfix<% end_if %>">
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
				<%  include Components/Pagination %>
			<% end_with %>

		<% else %>
		<article class="results-item--odd results-item--first clearfix">
			<p>Sorry, your search query did not return any results.</p>
		</article>
		<% end_if %>
	</main>
	<% include ContentFooter %>
</div>
