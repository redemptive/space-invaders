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
		$("body").append("<div id=\"player\"></div>");
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
		if (keyMap[68]  && player.position().left < $(window).width() - 10 - player.width()) {
			player.css("left", player.position().left + 10);
		} else if (keyMap[65] && player.position().left > 10) {
			player.css("left", player.position().left - 10);
		}
	}

	init();
	var player = $("#player");
});