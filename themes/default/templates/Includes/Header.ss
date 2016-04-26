<header class="header" role="banner">
	<% if $AvailableTranslations %>
	<div class="pure-g">
		<div class="pure-u-1">
			<h2 class="sr-only">Language Selector</h2>
			<ul id="lang" class="translations inline-list">
				<% loop $AvailableTranslations %>
					<li>
						<a href="$Link" lang="$LangName" hreflang="$LangName" class="<% if Current %>current  pure-button pure-button--default pure-button--pill<% end_if %>">
							$LangName
						</a>
					</li>
				<% end_loop %>
			</ul>
		</div>
	</div>
	<% end_if %>
	<div class="pure-g">
		<div class="search-group pure-u-1 pure-u-md-1-3">

			$SearchForm
			<a href="#menu" class="menu-trigger">
				<i class="icon-navicon-round"></i>
			</a>
		</div>
	</div>
</header>
