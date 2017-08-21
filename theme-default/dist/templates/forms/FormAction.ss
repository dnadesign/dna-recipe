<% if UseButtonTag %>
	<button $AttributesHTML>
		<% if ButtonContent %>$ButtonContent<% else %>$Title<% end_if %>
	</button>
<% else %>
	<div class="pure-button pure-button--primary">
		<input $AttributesHTML>
	</div>
<% end_if %>
