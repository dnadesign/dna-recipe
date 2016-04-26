<% if VisibleCarouselItems %>
<h2 class="sr-only">Image slider, uses keyboard to navigate</h2>
<div class="slider-wrap">
	<ul class="slides">
		<% loop VisibleCarouselItems %>
			<li class="$FirstLast slide-{$Pos} <% if First %>active-slide<% end_if %>">
				<% if Link %><a href="$Link.Link" class="slide-link"><% end_if %>
					<div class="image-wrap">
						<img src="$Image.CroppedImage(1200, 350).URL" alt="$Caption.LimitCharacters(255)">
					</div>

					<% if Caption %>
					<div class="text">
						<% if Title %>
						<h3>$Title</h3>
						<% end_if %>
						<p>$Caption.LimitCharacters(255)</p>
					</div>
					<% end_if %>
				<% if Link %></a><% end_if %>
			</li>
		<% end_loop %>
	</ul>
</div>
<% end_if %>
