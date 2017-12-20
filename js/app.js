$(document).ready(function() {

	var alienNumber = 7;
	var alienHeight = 100;
	//68 = right, 65 = left, 71 = g(fire)
	var keyMap = {68: false, 65: false, 71: false};
	var interval;
	var aliens = [];
	var alienLasers = [];
	var playerLaser = "";
	var alienDirection = "right";
	var alienFireCooldown = 200;
	var alienFireCounter = 0;
	var score = 0;
	var thePlayer = new Player(20, $(window).height() - 60, 40, 40, 3);
	var alienSprites = ["assets/alien.png","assets/alien2.png"];
	var endGame = false;
	var animateCounter = 0;
	var animateIndex = 0;
	var animateSpeed = 25;

	//Player object
	function Player(x, y, height, width, lives) {
		this.x = x;
		this.y = y;
		this.height = height;
		this.width = width;
		this.lives = lives;
	}

	Player.prototype.move = function(xMove, yMove) {
		this.x += xMove;
		this.y += yMove;
		$("#player").css("top", this.y + "px");
		$("#player").css("left", this.x + "px");
	}

	Player.prototype.buildHtml = function() {
		return "<div id=\"player\"><img src=\"assets/player.png\" width=\"" + this.width + "\" height=\"" + this.height + "\"></div>";
	}

	//Laser object
	function Laser(x, y, ySpeed, height, width, id) {
		this.x = x;
		this.y = y;
		this.height = height;
		this.width = width;
		this.id = id;
		this.ySpeed = ySpeed;
	}

	Laser.prototype.move = function() {
		this.y += this.ySpeed;
		$(".bullet").css("top", this.y + "px");
	}

	Laser.prototype.buildHtml = function() {
		return "<div id=\"" + this.id + "\" class=\"bullet\" style=\"height: " + this.height + "px; width: " + this.width + "px; top: " + this.y + "px;left: " + this.x + "px;\"></div>";
	}

	Laser.prototype.die = function() {
		$(".bullet").remove();
		playerLaser = "";
	}

	//AlienLaser Object
	function AlienLaser(x, y, ySpeed, height, width, id) {
		this.x = x;
		this.y = y;
		this.height = height;
		this.width = width;
		this.id = id;
		this.ySpeed = ySpeed;
	}

	AlienLaser.prototype.move = function() {
		this.y += this.ySpeed;
		$(".alienLaser").css("top", this.y + "px");
	}

	AlienLaser.prototype.buildHtml = function() {
		var result = "<div id=\"" + this.id + "\" class=\"alienLaser\" style=\"height: " + this.height + "px; width: " + this.width + "px; top: " + this.y + "px;left: " + this.x + "px;\"></div>";
		console.log(result);
		return result;
	}

	AlienLaser.prototype.die = function() {
		$(".alienLaser").remove();
		alienLasers.splice(alienLasers.indexOf(this));
	}

	//Alien object
	function Alien(x, y, id, height, width) {
		this.x = x;
		this.y = y;
		this.id = id;
		this.height = height;
		this.width = width;
		this.sprite = alienSprites[animateIndex];
	}

	Alien.prototype.buildHtml = function() {
		return "<div id=\"" + this.id + "\" class=\"alien\" style=\"height:" + this.height + "px; width: " + this.width + "top: " + this.y + "px;left: " + this.x + "px;\"><img src=\"" + this.sprite + "\" class=\"alien-img\"></div>";
	}

	Alien.prototype.changeImage = function(index) {
		this.sprite = alienSprites[index];
		$(".alien#" + this.id + " img").attr("src",alienSprites[index]);
	}

	Alien.prototype.move = function(xMove, yMove) {
		this.x += xMove;
		this.y += yMove;
		$(".alien#" + this.id).css("top", this.y + "px");
		$(".alien#" + this.id).css("left", this.x + "px");
	}

	Alien.prototype.fire = function() {
		alienLasers.push(new AlienLaser(this.x, this.y, 6 + score, 25, 10, 0));
	}

	Alien.prototype.die = function() {
		$(".alien#" + this.id).remove();
		aliens.splice(aliens.indexOf(this),1);
	}

	function init() {
		spawnAliens();
		$("body").append(thePlayer.buildHtml());
		$("body").append("<div id=\"score\">Score: " + score + "</div>");
		$("body").append("<div id=\"lives\">Lives: " + thePlayer.lives + "</div>");
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

	function updateHud() {
		$("#score").text("Score: " + score);
		$("#lives").text("Lives: " + thePlayer.lives);
	}

	function checkKeys() {
		if (keyMap[68] && thePlayer.x < $(window).width() - 10 - thePlayer.width) {
			thePlayer.move(10,0);
		} else if (keyMap[65] && thePlayer.x > 10) {
			thePlayer.move(-10,0);
		} else if (keyMap[71] && playerLaser === "") {
			playerLaser = new Laser(thePlayer.x, thePlayer.y, -10, 25, 10, 0);
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
		if (alienLasers.length != []) {
			for (var i = 0; i < alienLasers.length; i++) {
				alienLasers[i].move();
				if (alienLasers[i].y > $(window).height()) {
					alienLasers[i].die();
				}
			}
		}

	}

	function spawnAliens() {
		for (var i = 0; i <	alienNumber; i++) {
			aliens[i] = new Alien(i*100, 0, i, 100, 100);
			$("body").append(aliens[i].buildHtml());
		}
	}

	function manageAliens() {
		if (aliens[aliens.length - 1].x > $(window).width() - aliens[0].width && alienDirection == "right") {
			alienDirection = "left";
		} else if (aliens[0].x < 0 && alienDirection == "left") {
			alienDirection = "right";
		}
		if (animateCounter > animateSpeed) {
			animateCounter = 0;
			if (animateIndex < alienSprites.length) {
				animateIndex ++;
			} else {
				animateIndex = 0;
			}
		} else {
			animateCounter ++;
		}
		for (var i = 0; i < aliens.length; i++) {
			if (alienSprites[animateIndex] != aliens[i].sprite) {
				aliens[i].changeImage(animateIndex);
			}
			if (alienDirection == "right") {
				aliens[i].move(5 + (score/2),score / 40);
			} else {
				aliens[i].move(-5 - (score/2),score / 40);
			}
			if (playerLaser != "") {
				if (collission(aliens[i].x, aliens[i].y, aliens[i].width, aliens[i].height,playerLaser.x, playerLaser.y, playerLaser.width, playerLaser.height)) {
					score ++;
					updateHud();
					aliens[i].die();
					playerLaser.die();
				}
			}
		}
		if (alienFireCooldown < alienFireCounter) {
			aliens[Math.floor(Math.random() * aliens.length)].fire();
			$("body").append(alienLasers[alienLasers.length - 1].buildHtml());
			alienFireCounter = 0;
		} else {
			alienFireCounter++;
			alienFireCooldown = 200 - (score * 4);
		}
		if (aliens.length < 1) {
			spawnAliens();
		}
	}

	function gameLoop() {
		if (!endGame) {
			manageLasers();
			checkKeys();
			manageAliens();
			if (alienLasers.length > 0) {
				if (collission(thePlayer.x, thePlayer.y, thePlayer.width, thePlayer.height, alienLasers[0].x, alienLasers[0].y, alienLasers[0].width, alienLasers[0].height)) {
					alienLasers[0].die();
					thePlayer.lives --;
					updateHud();
					if (thePlayer.lives < 1) {
						endGame = true;
					}
				}
			}
			if (aliens[0].y > $(window).height() - thePlayer.height - aliens[0].height) {
				endGame = true;
			}
		} else {
			clearInterval(interval);
			$("body").empty();
			$("body").append("<div class=\"endGame\"><h2>You died! Score: " + score + "</h2></div>")
		}
	}

	init();
});