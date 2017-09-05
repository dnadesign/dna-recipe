<header class="header" role="banner">
	<% if $AvailableTranslations %>
	<div class="pure-g">
		<div class="pure-u-1">
			<% include Components/Translations %>
		</div>
	</div>
	<% end_if %>
	<div class="pure-g">
		<div class="search pure-u-1 pure-u-md-1-3">

			$SearchForm
			<a href="#menu" class="menu-trigger">
				<i class="icon-navicon-round"></i>
			</a>
		</div>
	</div>
</header>
