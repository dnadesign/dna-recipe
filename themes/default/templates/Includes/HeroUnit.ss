<% if $Content %>
<div class="hero-unit">
	<div class="content" id="main" role="main">
	$Content.RichLinks
	<% if LearnMorePage %>
		<a class="pure-button pure-button--primary" href="$LearnMorePage.Link">Learn more &raquo;</a>
	<% end_if %>
	</div>
</div>
<% end_if %>
