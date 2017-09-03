<footer class="pure-g contentfooter">
	<div class="pure-u-1">
		<% if $ClassName == EventPage %>
			<p class="pull--left"><a href="$Parent.Link">←  Back to the event listing</a></p>
		<% else_if $ClassName == NewsPage %>
			<p class="pull--left"><a href="$Parent.Link">←  Back to the news</a></p>
		<% else_if RegistryEntries %>
			<p class="pull--left results-actions">
				<a class="results-export" href="$Link(export)?$AllQueryVars" title="Export all results to a CSV spreadsheet file"><i class="icon-export" aria-hidden="true"></i>Export results to CSV</a>
				<a class="results-history" href="registry-feed/latest/{$DataClass}" title="View imported data history"><i class="icon-back-in-time" aria-hidden="true"></i>View imported data history</a>
			</p>
		<% end_if %>

		<% if $ClassName != HomePage %>
			<% include PrintShare %>
		<% end_if %>
		<% include UIKit/LastEdited %>
	</div>
</footer>
