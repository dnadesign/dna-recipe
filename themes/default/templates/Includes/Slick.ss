<% if $Items %>
<div class="slick slick-wrapper" data-slider>
	<% loop $Items %>
		<article class="slick-slide">

			<img src="$Image.URL" alt="$Title" width="200">
		</article>
	<% end_loop %>
</div>
<% end_if %>
