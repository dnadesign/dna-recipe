<div class="pure-g menu">
	<div class="menu-brand pure-u-1-2 pure-u-md-1-3">
		<a title="Return to homepage" href="$BaseHref">
			$SiteConfig.Title
		</a>
	</div>
	<nav class="menu-nav pure-menu pure-menu-horizontal pure-u-1-2 pure-u-md-2-3" role="navigation" id="main-menu">
		<h2 class="sr-only">Main navigation</h2>
		<ul class="pure-menu-list menu-list">
			<% loop Menu(1) %>
				<li class="$LinkingMode<% if Children %> has-children <% end_if %> pure-menu-item menu-item">
					<a href="$Link" class="$LinkingMode menu-link pure-menu-link <% if $LinkingMode = current %> pure-menu-selected<% end_if %>">
						$MenuTitle.XML
					</a>
					<% if Children %>
						<ul class="pure-menu-children">
							<% loop Children %>
								<li class="pure-menu-item menu-item">
									<a href="$Link" class="pure-menu-link menu-link">$MenuTitle.XML</a>
								</li>
							<% end_loop %>
						</ul>
					<% end_if %>
				</li>
			<% end_loop %>
		</ul>
	</nav>
</div>
