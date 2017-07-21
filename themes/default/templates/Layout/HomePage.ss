<% include Slick %>

<!-- Main hero unit for a primary marketing message or call to action -->
<main role="main" id="main">
	<% include Hero %>

	$Form
	$PageComments

	<h2 class="sr-only">Features</h2>
	<div class="pure-g">

		<% if Quicklinks %>
		<div class="linkset pure-u-1 pure-u-md-1-5">
			<h3><i class="icon-earth" aria-hidden="true"></i> Quicklinks</h3>
			<ul>
				<% loop Quicklinks %>
					<li class="$EvenOdd $FirstLast"><a href="$Link" class="$FirstLast">$Name</a></li>
				<% end_loop %>
			</ul>
		</div>
		<% end_if %>

		<% if NewsItems %>
		<div class="pure-u-1 <% if not Quicklinks %>pure-u-md-1-2<% else %>pure-u-md-2-5<% end_if %> results">
			<h3><a href="$NewsPage.Link"> <i class="icon-radio-waves" aria-hidden="true"></i> $NewsPage.Title</a></h3>
			<% loop getNewsItems(3) %>
				<article class="$EvenOdd $FirstLast item">
					<% include NewsItem %>
				</article>
			<% end_loop %>
		</div>
		<% end_if %>

		<div class="pure-u-1 <% if not Quicklinks %>pure-u-md-1-2<% else %>pure-u-md-2-5<% end_if %> feature">
			<% if $FeatureOneTitle %>
				<h3><% if $FeatureOneCategory %><i class="icon-$FeatureOneCategory" aria-hidden="true"></i> <% end_if %>$FeatureOneTitle</h3>
			<% end_if %>
			<% if FeatureOneContent %>
				$FeatureOneContent
			<% end_if %>
			<% if $FeatureOneLink && $FeatureOneButtonText %>
				<% if FeatureOneLink %>
					<p class="btn default metro medium"><a href="$FeatureOneLink.Link">$FeatureOneButtonText</a></p>
				<% end_if %>
			<% end_if %>

			<% if $FeatureTwoTitle %>
				<h3><% if $FeatureTwoCategory %><i class="icon-$FeatureTwoCategory" aria-hidden="true"></i> <% end_if %>$FeatureTwoTitle</h3>
			<% end_if %>
			<% if FeatureTwoContent %>
				$FeatureTwoContent
			<% end_if %>
			<% if $FeatureTwoLink && $FeatureTwoButtonText %>
				<% if FeatureTwoLink %>
					<p class="btn default metro medium"><a href="$FeatureTwoLink.Link">$FeatureTwoButtonText</a></p>
				<% end_if %>
			<% end_if %>
		</div>
	</div>
</main>

<% include ContentFooter %>
