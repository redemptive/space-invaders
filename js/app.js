$(document).ready(function() {
	var alienRows = 2;
	var alienColumns = 4;
	var alienHeight = 100;
	//68 = right, 65 = left, 71 = g(fire)
	var keyMap = {68: false, 65: false, 71: false};
	var interval = setInterval(gameLoop, 20);
	var bullet = "";
	var bulletTemplate = "<div id=\"bullet\"></div>"
	var aliens;

	function init() {
		for (var i = 0; i < alienRows; i++) {
			$(".container").append("<div id=\"" + i + "\" class=\"row\"></div>");
			for (var j = 0; j < alienColumns; j++) {
				$("#" + i).append("<div class=\"alien col-md-" + (12 / alienColumns) + "\"><img src=\"assets/alien.png\" class=\" alien-img img-responsive\"></div>");
			}
		}
		$("body").append("<div id=\"player\"></div>");
		$("#player").append("<img src=\"assets/player.png\" height=\"40\">");
		aliens = $(".alien");
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

	function collission(x1,y1,w1,h1,x2,y2,w2,h2) {
		var r1 = w1 + x1;
		var b1 = h1 + y1;
		var r2 = w2 + x2;
		var b2 = h2 + y2;
						
		if (x1 < r2 && r1 > x2 && y1 < b2 && b1 > y2) {
			return true;
		} else {
			return false;
		}
	}

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
			// for (var i = 0; i < aliens.length; i++) {
			// 	if (collission(aliens[i].position().top, aliens[i].position().left, aliens[i].width(), aliens[i].height(),bullet.position().top, bullet.position().left, bullet.width(), bullet.height())) {
			// 		alert("Collission");
			// 	}
			// }
			if (bullet.position().top < 0) {
				bullet.remove();
				bullet = "";
			}
			bullet.css("top", bullet.position().top - 10);
		}
	}

	init();
	var player = $("#player");
	console.log($(".alien")[0].position());
});