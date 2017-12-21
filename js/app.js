$(document).ready(function() {

	var interval;
	var game;

	//Game constructor
	function Game(player, playerLaser, aliens, alienLaser, alienSprites, alienNumber, alienDirection, alienFireCounter, alienFireCooldown, animateCounter, animateIndex, animateSpeed, endGame, keyMap, score) {
		this.player = player;
		this.playerLaser = playerLaser;
		this.aliens = aliens;
		this.alienLaser = alienLaser;
		this.alienSprites = alienSprites;
		this.alienNumber = alienNumber;
		this.alienDirection = alienDirection;
		this.alienFireCounter = alienFireCounter;
		this.alienFireCooldown = alienFireCooldown;
		this.animateCounter = animateCounter;
		this.animateIndex = animateIndex;
		this.animateSpeed = animateSpeed;
		this.endGame = endGame;
		this.keyMap = keyMap;
		this.score = score;
	}

	Game.prototype.updateHud = function() {
		$("#score").text("Score: " + this.score);
		$("#lives").text("Lives: " + this.player.lives);
	}

	Game.prototype.spawnAliens = function() {
		for (var i = 0; i <	this.alienNumber; i++) {
			this.aliens[i] = new Alien(i*100, 0, i, 100, 100, this.alienSprites[this.animateIndex]);
			$("body").append(this.aliens[i].buildHtml());
		}
	}

	Game.prototype.checkKeys = function() {
		if (this.keyMap[68] && this.player.x < $(window).width() - 10 - this.player.width) {
			this.player.move(10,0);
		} else if (this.keyMap[65] && this.player.x > 10) {
			this.player.move(-10,0);
		} else if (this.keyMap[71] && this.playerLaser === "") {
			this.playerLaser = new Laser(this.player.x, this.player.y, -10, 25, 10, 0, "bullet");
			$("body").append(this.playerLaser.buildHtml());
		}
	}

	Game.prototype.collission = function(x1,y1,w1,h1,x2,y2,w2,h2) {
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

	Game.prototype.manageLasers = function() {
		if (this.playerLaser != "") {
			this.playerLaser.move(0,-10);
			if (this.playerLaser.y < 0) {
				this.playerLaser.die();
				this.playerLaser = "";
			}
		}
		if (this.alienLaser != "") {
			this.alienLaser.move();
			if (this.alienLaser.y > $(window).height()) {
				this.alienLaser.die();
			}
		}
	}

	Game.prototype.manageAliens = function() {
		if (this.aliens[this.aliens.length - 1].x > $(window).width() - this.aliens[0].width && this.alienDirection == "right") {
			this.alienDirection = "left";
		} else if (this.aliens[0].x < 0 && this.alienDirection == "left") {
			this.alienDirection = "right";
		}
		if (this.animateCounter > this.animateSpeed) {
			this.animateCounter = 0;
			if (this.animateIndex < this.alienSprites.length) {
				this.animateIndex ++;
			} else {
				this.animateIndex = 0;
			}
		} else {
			this.animateCounter ++;
		}
		for (var i = 0; i < this.aliens.length; i++) {
			if (this.alienSprites[this.animateIndex] != this.aliens[i].sprite) {
				this.aliens[i].changeImage(this.alienSprites[this.animateIndex]);
			}
			if (this.alienDirection == "right") {
				this.aliens[i].move(5 + (this.score/2),this.score / 40);
			} else {
				this.aliens[i].move(-5 - (this.score/2),this.score / 40);
			}
			if (this.playerLaser != "") {
				if (this.collission(this.aliens[i].x, this.aliens[i].y, this.aliens[i].width, this.aliens[i].height,this.playerLaser.x, this.playerLaser.y, this.playerLaser.width, this.playerLaser.height)) {
					this.score ++;
					this.updateHud();
					this.aliens[i].die();
					this.playerLaser.die();
					this.playerLaser = "";
				}
			}
		}
		if (this.alienFireCooldown < this.alienFireCounter) {
			var randomAlien = Math.floor(Math.random() * this.aliens.length);
			this.alienLaser = new Laser(this.aliens[randomAlien].x, this.aliens[randomAlien].y, 6 + this.score, 25, 10, 0, "alienLaser");
			$("body").append(this.alienLaser.buildHtml());
			this.alienFireCounter = 0;
		} else {
			this.alienFireCounter++;
			this.alienFireCooldown = 200 - (this.score * 4);
		}
		if (this.aliens.length < 1) {
			this.spawnAliens();
		}
	}

	Game.prototype.gameLoop = function() {
		if (!this.endGame) {
			game.manageLasers();
			game.checkKeys();
			game.manageAliens();
			if (this.alienLaser != 0) {
				if (game.collission(game.player.x, game.player.y, game.player.width, game.player.height, game.alienLaser.x, game.alienLaser.y, game.alienLaser.width, game.alienLaser.height)) {
					game.alienLaser.die();
					game.player.lives --;
					game.updateHud();
					if (game.player.lives < 1) {
						endGame = true;
					}
				}
			}
			if (game.aliens[0].y > $(window).height() - game.player.height - game.aliens[0].height) {
				this.endGame = true;
			}
		} else {
			clearInterval(interval);
			$("body").empty();
			$("body").append("<div class=\"endGame\"><h2>You died! Score: " + this.score + "</h2></div>");
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
	function Laser(x, y, ySpeed, height, width, id, className) {
		this.x = x;
		this.y = y;
		this.height = height;
		this.width = width;
		this.id = id;
		this.ySpeed = ySpeed;
		this.className = className;
	}

	Laser.prototype.move = function() {
		this.y += this.ySpeed;
		$("." + this.className).css("top", this.y + "px");
	}

	Laser.prototype.buildHtml = function() {
		return "<div id=\"" + this.id + "\" class=\""+ this.className + "\" style=\"height: " + this.height + "px; width: " + this.width + "px; top: " + this.y + "px;left: " + this.x + "px;\"></div>";
	}

	Laser.prototype.die = function() {
		$("." + this.className).remove();
	}

	//Alien constructor
	function Alien(x, y, id, height, width, sprite) {
		this.x = x;
		this.y = y;
		this.id = id;
		this.height = height;
		this.width = width;
		this.sprite = sprite;
	}

	Alien.prototype.buildHtml = function() {
		return "<div id=\"" + this.id + "\" class=\"alien\" style=\"height:" + this.height + "px; width: " + this.width + "top: " + this.y + "px;left: " + this.x + "px;\"><img src=\"" + this.sprite + "\" class=\"alien-img\"></div>";
	}

	Alien.prototype.changeImage = function(sprite) {
		this.sprite = sprite;
		$(".alien#" + this.id + " img").attr("src", this.sprite);
	}

	Alien.prototype.move = function(xMove, yMove) {
		this.x += xMove;
		this.y += yMove;
		$(".alien#" + this.id).css("top", this.y + "px");
		$(".alien#" + this.id).css("left", this.x + "px");
	}

	Alien.prototype.die = function() {
		$(".alien#" + this.id).remove();
		game.aliens.splice(game.aliens.indexOf(this),1);
	}

	function init() {
		game = new Game(new Player(20, $(window).height() - 60, 40, 40, 3), "", [], "", ["assets/alien.png","assets/alien2.png"], 6, "right", 0, 200, 0, 0, 25, false, {68: false, 65: false, 71: false}, 0);
		game.spawnAliens();
		$("body").append(game.player.buildHtml());
		$("body").append("<div id=\"score\">Score: " + game.score + "</div>");
		$("body").append("<div id=\"lives\">Lives: " + game.player.lives + "</div>");
		interval = setInterval(game.gameLoop, 20);
	}

	$(document).keydown(function(e) {
		if (e.keyCode in game.keyMap) {
			game.keyMap[e.keyCode] = true;
		}
	}).keyup(function(e) {
		if (e.keyCode in game.keyMap) {
			game.keyMap[e.keyCode] = false;
		}
	});
	init();
});