<div class="resultsabstract<% if FeaturedImage %> resultsabstract--hasimage<% end_if %>">
	<header class="resultsabstract-header">
		<h4 class="resultsabstract-title">
			<a class="resultsabstract-link" href="$Link">$Title</a>
		</h4>
		<span class="resultsabstract-subtitle metadata">
			<% if Category %>
				<a href="$Category.Link">$Category.Title</a>
			<% end_if %>
			<% if $Date %>
				<time datetime="$Date">$Date.nice <% if $StartTime %>$StartTime.Nice <% end_if %>
				</time>
			<% end_if %>
			<% if Author %>by $Author<% end_if %>
		</span>
	</header>
	<p class="resultsabstract-text">
		<% if Abstract %>
			$Abstract
		<% else %>
			$Content.LimitWordCount
		<% end_if %>
	</p>
</div>
<% if FeaturedImage %>
	<figure class="resultsabstract-image featured-image">
		$FeaturedImage.SetSize(200, 120)
	</figure>
<% end_if %>
