<h2 class="sr-only">Language Selector</h2>
<ul id="lang" class="translations list list--inline">
	<% loop $AvailableTranslations %>
		<li class="translations-item">
			<a href="$Link" lang="$LangName" hreflang="$LangName" class="translations-link<% if Current %> pure-button<% end_if %>">
				$LangName
			</a>
		</li>
	<% end_loop %>
</ul>
