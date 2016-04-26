<% if MoreThanOnePage %>
<div id="PageNumbers" class="pagination">
	<h3 class="sr-only">Results</h3>
	<ul class="pure-paginator">
		<li>
			<% if $NotFirstPage %>
				<a class="pure-button pure-button--default prev" href="$PrevLink" title="View the previous page">Prev</a>
			<% else %>
				<span class="pure-button pure-button--disabled prev disabled" href="#">Prev</span>
			<% end_if %>
		</li>
	
		<% loop PaginationSummary %>
			<li>
				<% if $CurrentBool %>
				<a class="pure-button pure-button--primary" href="#">$PageNum</a>
				<% else %>
				<a class="pure-button pure-button--default" href="$Link" title="View page number $PageNum">$PageNum</a>
				<% end_if %>
			</li>
		<% end_loop %>
		<li>
		<% if $NotLastPage %>
			<a class="pure-button pure-button--default next" href="$NextLink" title="View the next page">Next</a>
		<% else %>
			<span class="pure-button pure-button--default pure-button--disabled next disabled">Next</span>
		<% end_if %>
		</li>
	</ul>
</div>
<% end_if %>