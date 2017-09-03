<% include Components/Breadcrumbs %>
<div class="pure-g pure-g-padding">
	<div class="pure-u-1 pure-u-md-1-4">
		<div class="sidebar-form filter">
			<div id="{$DataClass}_searchform" class="searchForm">
				<h2 class="small">Search Filter</h2>
				<% if RegistryEntries %>
				$RegistryFilterForm
				<% end_if %>
			</div>
		</div>
	</div>

	<div class="pure-u-1 pure-u-md-3-4">
		<main id="main" class="main" role="main">
			<h1 class="page-header">$Title</h1>

			$Content.RichLinks

			<div id="{$DataClass}_results" class="results-container">
				<% if RegistryEntries %>
					<table summary="Search results for $DataClass">
						<thead>
							<tr>
								<% loop Columns %>
									<th><a href="$Top.QueryLink&amp;Sort={$Name}&amp;Dir={$Top.OppositeDirection}#results"><i class="icon-arrow-combo"></i> $Title</a></th>
								<% end_loop %>
							</tr>
						</thead>
						<tbody>
							<% loop RegistryEntries %>
								<tr class="<% if FirstLast %>$FirstLast <% end_if %>$EvenOdd">
									<% loop Columns %>
										<td><% if Link %><a href="$Link">$Value</a><% else %>$Value<% end_if %></td>
									<% end_loop %>
								</tr>
							<% end_loop %>
						</tbody>
					</table>

					<% with RegistryEntries %>
						<%  include Components/Pagination %>
					<% end_with %>
				<% else %>
					<p class="no-results">No results to show.</p>
				<% end_if %>

			</div>
			<% include ContentFooter %>
		</main>
	</div>
</div>
