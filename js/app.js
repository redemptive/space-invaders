$(document).ready(function() {
	var alienRows = 2;
	var alienColumns = 4;
	var alienHeight = 100;
	//68 = right, 65 = left, 71 = g(fire)
	var keyMap = {68: false, 65: false, 71: false};
	var interval = setInterval(gameLoop, 20);
	var bullet = "";
	var bulletTemplate = "<div id=\"bullet\" style=\"height: 25px; width: 10px; z-index: 2; position: absolute; bottom: 10px; background-color: #FF0000\"></div>"

	function init() {
		for (var i = 0; i < alienRows; i++) {
			$(".container").append("<div id=\"" + i + "\" class=\"row\"></div>");
			for (var j = 0; j < alienColumns; j++) {
				$("#" + i).append("<div class=\"alien col-md-" + (12 / alienColumns) + "\"><img src=\"assets/alien.png\" class=\" alien-img img-responsive\"></div>");
			}
		}
		$("body").append("<div id=\"player\"></div>")
		$("#player").append("<img src=\"assets/player.png\" height=\"40\">");
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
		} else if (keyMap[71] && bullet == "") {
			$("body").append(bulletTemplate);
			bullet = $("#bullet");
			bullet.css("left", player.position().left);
		}
		if (bullet != "") {
			if (bullet.position().top < 0) {
				bullet.remove();
				bullet = "";
			}
			bullet.css("top", bullet.position().top - 10);
		}
	}

	init();
	var player = $("#player");
});