<html lang="$ContentLocale">
	<head>
		<meta http-equiv="content-type" content="text/html; charset=utf-8" />
		<script>
			function subst() {
				var vars={};
				var x=document.location.search.substring(1).split('&');
				for(var i in x) {var z=x[i].split('=',2);vars[z[0]] = unescape(z[1]);}
				var x=['frompage','topage','page','webpage','section','subsection','subsubsection'];
				for(var i in x) {
					var y = document.getElementsByClassName(x[i]);
					for(var j=0; j<y.length; ++j) y[j].textContent = vars[x[i]];
				}
			}
		</script>
		<style>
			td {
				font-size: 10pt;
				line-height: 16pt;
				background: #fff;
				color: #3e4b50;
				margin: 0;
				padding: 0;
			}
			#SiteFooter {
				width: 505pt;
				text-align: left;
			}
			#PageNumber {
				text-align: right;
			}
		</style>
	</head>
	<body onload="subst();">
		<table>
			<tr>
				<td id="SiteFooter">
					<span id="FooterText">$Title | $SiteConfig.Title</span>
				</td>
				<td id="PageNumber">
					<span id="PageNumberText" class="page"></span>
				</td>
			</tr>
		</table>
	</body>
</html>

