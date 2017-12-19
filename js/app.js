$(document).ready(function() {

	var alienNumber = 7;
	var alienHeight = 100;
	//68 = right, 65 = left, 71 = g(fire)
	var keyMap = {68: false, 65: false, 71: false};
	var interval = setInterval(gameLoop, 20);
	var aliens = [];
	var lasers = [];
	var alienDirection = "right";
	var alienFireCooldown = 5000;
	var alienFireCounter = 0;
	var score = 0;
	var thePlayer = new player();

	function player() {
		this.x = 20;
		this.y = $(window).height() - 60;
		this.height = 40;
		this.width = 40;
		this.move = function(xMove, yMove) {
			this.x += xMove;
			this.y += yMove;
			$("#player").css("top", this.y + "px");
			$("#player").css("left", this.x + "px");
		}
		this.buildHtml = function() {
			return "<div id=\"player\"><img src=\"assets/player.png\" width=\"" + this.width + "\" height=\"" + this.height + "\"></div>";
		}
	}

	function laser(x, y, ySpeed, id) {
		this.x = x;
		this.y = y;
		this.height = 25;
		this.width = 10;
		this.id = id;
		this.ySpeed = ySpeed;
		this.move = function() {
			this.y += this.ySpeed;
			$(".bullet#" + this.id).css("top", this.y + "px");
		};
		this.buildHtml = function() {
			return "<div id=\"" + this.id + "\" class=\"bullet\" style=\"height: " + this.height + "px; width: " + this.width + "px; top: " + this.y + "px;left: " + this.x + "px;\"></div>";
		};
		this.die = function() {
			$(".bullet#" + this.id).remove();
			lasers.splice(lasers.indexOf(this),1);
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
		this.move = function(xMove, yMove) {
			this.x += xMove;
			this.y += yMove;
			$(".alien#" + this.id).css("top", this.y + "px");
			$(".alien#" + this.id).css("left", this.x + "px");
		};
		this.die = function() {
			$(".alien#" + this.id).remove();
			aliens.splice(aliens.indexOf(this),1);
		}
	}

	function init() {
		for (var i = 0; i <	alienNumber; i++) {
			aliens[i] = new alien(i*100, 0, i);
			$("body").append(aliens[i].buildHtml());
		}
		$("body").append(thePlayer.buildHtml());
		$("body").append("<div id=\"score\">Score: " + score + "</div>");
		console.log(thePlayer);
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

	function updateScore() {
		$("#score").text("Score: " + score);
	}

	function gameLoop() {
		if (keyMap[68] && thePlayer.x < $(window).width() - 10 - thePlayer.width) {
			thePlayer.move(10,0);
		} else if (keyMap[65] && thePlayer.x > 10) {
			thePlayer.move(-10,0);
		} else if (keyMap[71] && lasers.length == 0) {
			lasers.push(new laser(thePlayer.x, thePlayer.y, -10,lasers.length));
			$("body").append(lasers[0].buildHtml());
		}
		if (lasers.length > 0) {
			lasers[0].move();
			console.log(lasers[0]);
			if (lasers[0].y < 0) {
				lasers[0].die();
			}
		}
		if (aliens.length < 1) {
			for (var i = 0; i <	alienNumber; i++) {
				aliens[i] = new alien(i*100, 0, i);
				$("body").append(aliens[i].buildHtml());
			}
		}
		if (aliens[aliens.length - 1].x > $(window).width() - aliens[0].width && alienDirection == "right") {
			alienDirection = "left";
		} else if (aliens[0].x < 0 && alienDirection == "left") {
			alienDirection = "right";
		}
		for (var i = 0; i < aliens.length; i++) {
			if (alienDirection == "right") {
				aliens[i].move(5 + score,0);
			} else {
				aliens[i].move(-5 - score,0);
			}
			if (lasers.length > 0) {
				if (collission(aliens[i].x, aliens[i].y, aliens[i].width, aliens[i].height,lasers[0].x, lasers[0].y, lasers[0].width, lasers[0].height)) {
					score ++;
					updateScore();
					aliens[i].die();
				}
			}
		}
	}

	init();
});