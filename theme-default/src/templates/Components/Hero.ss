<% if $Content %>
<div class="hero">
	<div class="hero-content">
	$Content.RichLinks
	<% if LearnMorePage %>
		<a class="pure-button pure-button--primary" href="$LearnMorePage.Link">Learn more &raquo;</a>
	<% end_if %>
	</div>
</div>
<% end_if %>
