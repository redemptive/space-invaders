$(document).ready(function() {

	var alienNumber = 6;
	var alienHeight = 100;
	//68 = right, 65 = left, 71 = g(fire)
	var keyMap = {68: false, 65: false, 71: false};
	var interval = setInterval(gameLoop, 20);
	var bullet = "";
	var aliens = [];

	var laser = {
		buildHtml: function() {
			return "<div id=\"bullet\"></div>";
		}
	}

	function alien(x, y, id) {
		this.x = x;
		this.y = y;
		this.id = id;
		this.height = 100;
		this.width = 100;
		this.sprite = "assets/alien.png";
		this.buildHtml = function() {
			return "<div id=\"" + this.id + "\" class=\"alien\" style=\"height:" + this.height + "px; width: " + this.width + "top: " + this.y + "px;left: " + this.x + "px;\"><img src=\"" + this.sprite + "\" class=\"alien-img\"></div>";
		};
		this.die = function() {
			$("#" + this.id).remove();
			aliens.splice(aliens.indexOf(this),1);
		}
	}

	function init() {
		for (var i = 0; i <	alienNumber; i++) {
			aliens[i] = new alien(i*100, 0, i);
			$("body").append(aliens[i].buildHtml());
		}
		$("body").append("<div id=\"player\"></div>");
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
			$("body").append(laser.buildHtml());
			bullet = $("#bullet");
			bullet.css("left", player.position().left + "px");
		}
		if (bullet != "") {
			for (var i = 0; i < aliens.length; i++) {
				if (collission(aliens[i].x, aliens[i].y, aliens[i].width, aliens[i].height,bullet.position().left, bullet.position().top, bullet.width(), bullet.height())) {
					console.log("Collission");
					aliens[i].die();
				}
				
			}
			bullet.css("top", bullet.position().top - 10 + "px");
			if (bullet.position().top < 0) {
				bullet.remove();
				bullet = "";
			}
		}
	}

	init();
	var player = $("#player");
});