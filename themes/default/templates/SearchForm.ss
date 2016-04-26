<form $FormAttributes role="search" class="">
	<fieldset class="">
	<input id="SearchForm_SearchForm_Search" class="search-query text" type="search" name="Search" placeholder="Search" value="$SearchQuery" title="Enter search terms"  autosave="search-query"  />

	<% loop $Actions %>
		$Field
	<% end_loop %>
	</fieldset>
</form>