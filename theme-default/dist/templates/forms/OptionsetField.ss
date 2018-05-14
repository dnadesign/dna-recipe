<ul id="$ID" class="$extraClass"<% if Description %> title="$Description"<% end_if %>>
	<% loop Options %>
		<li class="$Class">
			<label for="$ID" class="radio">
				<input id="$ID" class="radio" name="$Name" type="radio" value="$Value"<% if isChecked %> checked<% end_if %><% if isDisabled %> disabled<% end_if %>>
				$Title
			</label>
		</li>
	<% end_loop %>
</ul>
