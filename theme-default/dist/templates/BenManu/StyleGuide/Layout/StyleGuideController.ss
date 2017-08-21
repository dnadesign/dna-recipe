<% if $Sections %>
	<div class="sg-row">
		<div class="sg-col-sm-3 sg-col-lg-2">
		<% include BenManu/StyleGuide/SGSubNavigation %>
		</div>
		<div class="sg-col-sm-9 sg-col-lg-10">
			<% loop $Sections %>
				<section class="$FirstLast sectionoverview">
					$forTemplate
				</section>
			<% end_loop %>
		</div>

	</div>
<% end_if %>
