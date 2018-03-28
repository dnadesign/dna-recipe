<dl>
	<% if $Date %>
		<dt>Date</dt>
		<dd><time datetime="$Date">$Date.Format(d/m/Y) <% if $StartTime %>$StartTime.Nice <% if $EndTime %>- $EndTime.Nice <% end_if %><% end_if %></time></dd>
	<% end_if %>
	<% if Author %>
		<dt>Author:</dt>
		<dd>$Author</dd>
	<% end_if %>
	<% if Location %>
		<dt>Location:</dt>
		<dd>$NiceLocation</dd>
	<% end_if %>
	<% if Terms %>
		<dt>Tags</dt>
		<dd>
			<ul class="list list--inline">
				<% loop Terms %>
					<li class="label default">$Name</li>
				<% end_loop %>
			</ul>
		</dd>
	<% end_if %>
</dl>
