<footer class="footer typography" role="contentinfo">
	<div class="container">
		<h2 class="sr-only">Footer</h2>
		<div class="pure-g">
			<% if Footer %>
			<div class="pure-u-1<% if SiteConfig.FacebookURL || SiteConfig.TwitterUsername %> pure-u-md-2-3<% end_if %>">
				<ul class="list list--inline">
					<% with Footer %>
						<% loop Children %>
							<li class="$LinkingMode<% if $LinkingMode = current %> active<% end_if %>">
								<a href="$Link" class="<% if $LinkingMode = current %>current default<% else %>light<% end_if %> badge">
									$MenuTitle.XML
								</a>
							</li>
						<% end_loop %>
					<% end_with %>
				</ul>
			</div>
			<% end_if %>

			<% if SiteConfig.FacebookURL || SiteConfig.TwitterUsername %>
			<div class="sociallinks pure-u-1 <% if Footer %> pure-u-md-1-3<% end_if %>" role="complementary">
				<% if SiteConfig.TwitterUsername %>
					<a class="sociallinks-item" href="http://www.twitter.com/$SiteConfig.TwitterUsername">
						<i class="icon-social-twitter sociallinks-icon" aria-hidden="true"></i>Follow us on Twitter
					</a>
				<% end_if %>
				<% if SiteConfig.FacebookURL %>
					<a class="sociallinks-item" href="http://www.facebook.com/$SiteConfig.FacebookURL">
						<i class="icon-social-facebook sociallinks-icon" aria-hidden="true"></i>Join us on Facebook
					</a>
				<% end_if %>
			</div>
			<% end_if %>
		</div>
		<div class="pure-g">
			<div class="pure-u-1">
				<div class="footer-logo">
					<% if SiteConfig.FooterLogo %>
						<% if SiteConfig.FooterLogoLink %>
							<a href="$SiteConfig.FooterLogoLink">
						<% end_if %>
							<img src="$SiteConfig.FooterLogo.URL" width="$SiteConfig.FooterLogo.Width" height="$SiteConfig.FooterLogo.Height"<% if SiteConfig.FooterLogoDescription %> alt="$SiteConfig.FooterLogoDescription" title="$SiteConfig.FooterLogoDescription"<% end_if %> />
						<% if SiteConfig.FooterLogoLink %>
							</a>
						<% end_if %>
					<% end_if %>
				</div>
				<div class="footer-copyright">
					<p><small>$SiteConfig.Title &copy; $CurrentDatetime.Format(Y)</small></p>
				</div>
			</div>
		</div>
	</div>
</footer>
