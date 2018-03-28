<header>
	<h4 class="heading-plain-small"><a href="$Link">$Title</a></h4>
</header>

<% if $Date %>
	<p class="metadata">
		<time datetime="$Date">$Date.Format(d/m/Y) <% if $StartTime %>$StartTime.Nice <% if $EndTime %>- $EndTime.Nice <% end_if %><% end_if %></time>
	</p>
<% end_if %>

<p>
<% if Abstract %>
	$Abstract
<% else %>
	$Content.LimitWordCount
<% end_if %>
</p>