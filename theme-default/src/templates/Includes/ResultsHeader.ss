<div class="results-header">
	<span class="results-subtitle pull--left">
		<% if FilterDescription %>
			$FilterDescription
		<% else %>
			<% if Top.ClassName == EventHolder %>
				Upcoming events
			<% else_if Top.ClassName == NewsHolder %>
				News
			<% else_if $Query %>
				Results for &quot;{$Query}&quot;
			<% else %>
				Items
			<% end_if %>
		<% end_if %>
	</span>
	<span class="results-meta pull--right">
		<% if FilteredUpdates %>
			<% with FilteredUpdates %>$FirstItem - $LastItem of $count
			<% end_with %>
		<% else_if Results %>
			Displaying Page $Results.CurrentPage of $Results.TotalPages
		<% else %>
			none
		<% end_if %>
	</span>
</div>
