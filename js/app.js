$(document).ready(function() {
	var alienRows = 2;
	var alienColumns = 4;
	var alienHeight = 100;
	//68 = right, 65 = left
	var keyMap = {68: false, 65: false};
	var interval = setInterval(gameLoop, 20);

	function init() {
		for (var i = 0; i < alienRows; i++) {
			$(".container").append("<div id=\"" + i + "\" class=\"row\"></div>");
			for (var j = 0; j < alienColumns; j++) {
				$("#" + i).append("<div class=\"alien col-md-" + (12 / alienColumns) + "\"></div>");
				$("#" + i).css("height", alienHeight + "px");
			}
		}
		$(".container").append("<div id=\"player\">hi</div>");
	}

	$(document).keydown(function(e) {
		if (e.keyCode in keyMap) {
			keyMap[e.keyCode] = true;
		}
	}).keyup(function(e) {
		if (e.keyCode in keyMap) {
			keyMap[e.keyCode] = false;
		}
	});

	function gameLoop() {
		if (keyMap[65] || keyMap[68]) {
			console.log(keyMap);
		}
	}

	init();
});