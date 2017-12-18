$(document).ready(function() {
	var alienRows = 2;
	var alienColumns = 4;
	var alienHeight = 100;

	for (var i = 0; i < alienRows; i++) {
		$(".container").append("<div id=\"" + i + "\" class=\"row\"></div>");
		for (var j = 0; j < alienColumns; j++) {
			$("#" + i).append("<div class=\"alien col-md-" + (12 / alienColumns) + "\"></div>");
			$("#" + i).css("height", alienHeight + "px");
		}
	}
	$(".container").append("<div id=\"player\">hi</div>");
});