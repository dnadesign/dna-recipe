<nav class="filter" role="navigation" id="page-nav">
	<h2 class="heading-plain-small">Filter by tag</h2>
	<ul class="filter-tags">
		<li class="label <% if $Top.CurrentTag.ID==$ID %>active primary<% else %> default<% end_if %>"><a href="$AllTagsLink" title="View all tags">View all tags</a></li>
		<% loop UpdateTagsWithLinks %>
			<li class="label <% if $Top.CurrentTag.ID==$ID %>active primary<% else %> default<% end_if %>"><a href="$Link" title="View $Name">$Name</a></li>
		<% end_loop %>
	</ul>
</nav>

<div class="filter">
	<h2 class="heading-plain-small">Filter by date range</h2>

	<% with DateRangeForm %>
		<form $FormAttributes>
			<% if ErrorMessage %>
				<div id="{$FormName}_error" class="message $ErrorMessageType">$ErrorMessage</div>
			<% else %>
				<div id="{$FormName}_error" class="message $ErrorMessageType" style="display: none"></div>
			<% end_if %>

			<fieldset>
				<div class="field-note message primary" id="tip-dates">
					Tip: Leave one field blank to search for a single date.
				</div>
				<div id="from" class="field date text">
					<label class="left" for="{$FormName}_from">Filter from date <span class="field-note metadata">(example: 31/12/13)</span></label>
					$Fields.dataFieldByName(from)
				</div>
				<div id="to" class="field date text">
					<label class="left" for="{$FormName}_to">Filter to date <span class="field-note metadata">(example: 31/12/13)</span></label>
					$Fields.dataFieldByName(to)
				</div>
				$Fields.dataFieldByName(tag)
				$Fields.dataFieldByName(SecurityID)
			</fieldset>

			<div class="Actions">
				<% if Actions %>
					<% loop Actions %>$Field<% end_loop %>
				<% end_if %>
			</div>
		</form>
	<% end_with %>
</div>
