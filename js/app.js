$(document).ready(function() {

	var alienNumber = 7;
	var alienHeight = 100;
	//68 = right, 65 = left, 71 = g(fire)
	var keyMap = {68: false, 65: false, 71: false};
	var interval;
	var aliens = [];
	var playerLaser = "";
	var alienDirection = "right";
	var alienFireCooldown = 5000;
	var alienFireCounter = 0;
	var score = 0;
	var thePlayer = new player();
	var alienSprites = ["assets/alien.png","assets/alien2.png"];

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
		this.id = 0;
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
			playerLaser = "";
		}
	}

	function alien(x, y, id) {
		this.x = x;
		this.y = y;
		this.id = id;
		this.height = 100;
		this.width = 100;
		this.sprite = alienSprites[Math.floor(Math.random() * 2)];
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
		spawnAliens();
		$("body").append(thePlayer.buildHtml());
		$("body").append("<div id=\"score\">Score: " + score + "</div>");
		interval = setInterval(gameLoop, 20);
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

	function checkKeys() {
		if (keyMap[68] && thePlayer.x < $(window).width() - 10 - thePlayer.width) {
			thePlayer.move(10,0);
		} else if (keyMap[65] && thePlayer.x > 10) {
			thePlayer.move(-10,0);
		} else if (keyMap[71] && playerLaser === "") {
			playerLaser = new laser(thePlayer.x, thePlayer.y, -10,0);
			$("body").append(playerLaser.buildHtml());
		}
	}

	function manageLasers() {
		if (playerLaser != "") {
			playerLaser.move(0,-10);
			if (playerLaser.y < 0) {
				playerLaser.die();
			}
		}
	}

	function spawnAliens() {
		for (var i = 0; i <	alienNumber; i++) {
			aliens[i] = new alien(i*100, 0, i);
			$("body").append(aliens[i].buildHtml());
		}
	}

	function moveAliens() {
		if (aliens[aliens.length - 1].x > $(window).width() - aliens[0].width && alienDirection == "right") {
			alienDirection = "left";
		} else if (aliens[0].x < 0 && alienDirection == "left") {
			alienDirection = "right";
		}
	}

	function gameLoop() {
		checkKeys();
		moveAliens();
		manageLasers();
		if (aliens.length < 1) {
			spawnAliens();
		}
		for (var i = 0; i < aliens.length; i++) {
			if (alienDirection == "right") {
				aliens[i].move(5 + score,0);
			} else {
				aliens[i].move(-5 - score,0);
			}
			if (playerLaser != "") {
				if (collission(aliens[i].x, aliens[i].y, aliens[i].width, aliens[i].height,playerLaser.x, playerLaser.y, playerLaser.width, playerLaser.height)) {
					score ++;
					updateScore();
					aliens[i].die();
					playerLaser.die();
				}
			}
		}
	}

	init();
});