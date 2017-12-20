$(document).ready(function() {

	var alienNumber = 7;
	var alienHeight = 100;
	//68 = right, 65 = left, 71 = g(fire)
	var keyMap = {68: false, 65: false, 71: false};
	var interval;
	var alienLasers = [];
	var playerLaser = "";
	var alienDirection = "right";
	var alienFireCooldown = 200;
	var alienFireCounter = 0;
	var score = 0;
	var alienSprites = ["assets/alien.png","assets/alien2.png"];
	var endGame = false;
	var animateCounter = 0;
	var animateIndex = 0;
	var animateSpeed = 25;
	var game = new Game(new Player(20, $(window).height() - 60, 40, 40, 3), []);

	//Game constructor
	function Game(player, aliens) {
		this.player = player;
		this.aliens = aliens;
	}

	Game.prototype.updateHud = function() {
		$("#score").text("Score: " + score);
		$("#lives").text("Lives: " + game.player.lives);
	}

	Game.prototype.spawnAliens = function() {
		for (var i = 0; i <	alienNumber; i++) {
			this.aliens[i] = new Alien(i*100, 0, i, 100, 100);
			$("body").append(this.aliens[i].buildHtml());
		}
	}

	Game.prototype.checkKeys = function() {
		if (keyMap[68] && game.player.x < $(window).width() - 10 - game.player.width) {
			game.player.move(10,0);
		} else if (keyMap[65] && game.player.x > 10) {
			game.player.move(-10,0);
		} else if (keyMap[71] && playerLaser === "") {
			playerLaser = new Laser(game.player.x, game.player.y, -10, 25, 10, 0);
			$("body").append(playerLaser.buildHtml());
		}
	}

	//Player constructor
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

	//Laser constructor
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

	//AlienLaser constructor
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

	//Alien constructor
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
		game.aliens.splice(game.aliens.indexOf(this),1);
	}

	function init() {
		game.spawnAliens();
		$("body").append(game.player.buildHtml());
		$("body").append("<div id=\"score\">Score: " + score + "</div>");
		$("body").append("<div id=\"lives\">Lives: " + game.player.lives + "</div>");
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

	function manageAliens() {
		if (game.aliens[game.aliens.length - 1].x > $(window).width() - game.aliens[0].width && alienDirection == "right") {
			alienDirection = "left";
		} else if (game.aliens[0].x < 0 && alienDirection == "left") {
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
		for (var i = 0; i < game.aliens.length; i++) {
			if (alienSprites[animateIndex] != game.aliens[i].sprite) {
				game.aliens[i].changeImage(animateIndex);
			}
			if (alienDirection == "right") {
				game.aliens[i].move(5 + (score/2),score / 40);
			} else {
				game.aliens[i].move(-5 - (score/2),score / 40);
			}
			if (playerLaser != "") {
				if (collission(game.aliens[i].x, game.aliens[i].y, game.aliens[i].width, game.aliens[i].height,playerLaser.x, playerLaser.y, playerLaser.width, playerLaser.height)) {
					score ++;
					game.updateHud();
					game.aliens[i].die();
					playerLaser.die();
				}
			}
		}
		if (alienFireCooldown < alienFireCounter) {
			game.aliens[Math.floor(Math.random() * game.aliens.length)].fire();
			$("body").append(alienLasers[alienLasers.length - 1].buildHtml());
			alienFireCounter = 0;
		} else {
			alienFireCounter++;
			alienFireCooldown = 200 - (score * 4);
		}
		if (game.aliens.length < 1) {
			game.spawnAliens();
		}
	}

	function gameLoop() {
		if (!endGame) {
			manageLasers();
			game.checkKeys();
			manageAliens();
			if (alienLasers.length > 0) {
				if (collission(game.player.x, game.player.y, game.player.width, game.player.height, alienLasers[0].x, alienLasers[0].y, alienLasers[0].width, alienLasers[0].height)) {
					alienLasers[0].die();
					game.player.lives --;
					game.updateHud();
					if (game.player.lives < 1) {
						endGame = true;
					}
				}
			}
			if (game.aliens[0].y > $(window).height() - game.player.height - game.aliens[0].height) {
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