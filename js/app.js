$(document).ready(function() {

	var game;

	class Game {
		constructor(player, playerLaser, aliens, alienLaser, alienSprites, alienNumber, aliensPerRow, alienDirection, alienFireCounter, alienFireCooldown, animateCounter, animateIndex, animateSpeed, endGame, keyMap, score) {
			this.player = player;
			this.playerLaser = playerLaser;
			this.aliens = aliens;
			this.alienLaser = alienLaser;
			this.alienSprites = alienSprites;
			this.alienNumber = alienNumber;
			this.aliensPerRow = aliensPerRow;
			this.alienDirection = alienDirection;
			this.alienFireCounter = alienFireCounter;
			this.alienFireCooldown = alienFireCooldown;
			this.animateCounter = animateCounter;
			this.animateIndex = animateIndex;
			this.animateSpeed = animateSpeed;
			this.endGame = endGame;
			this.keyMap = keyMap;
			this.score = score;
			//function calls
			this.spawnAliens();
			this.initScreen();
			this.interval = setInterval(this.gameLoop, 20);
		}

		initScreen() {
			//Draw player, score and lives to the screen
			$('body').append(this.player.html);
			$('body').append(`<div id="score">Score: ${this.score}</div>`);
			$('body').append(`<div id="lives">Lives: ${this.player.lives}</div>`);
		}
		
		updateHud() {
			//Update score and lives when they change
			$('#score').text(`Score: ${this.score}`);
			$('#lives').text(`Lives: ${this.player.lives}`);
		}

		spawnAliens() {
			//For the current number of aliens, put a new Alien in the aliens array and put it on the screen
			this.alienNumber ++;
			for (let i = 0; i <	this.alienNumber; i++) {
				if (i < this.aliensPerRow) {
					this.aliens[i] = new Alien(i*100, 0, i, 100, 100, this.alienSprites[this.animateIndex]);
				} else {
					this.aliens[i] = new Alien((i - 5)*100, 120, i, 100, 100, this.alienSprites[this.animateIndex]);
				}
				$('body').append(this.aliens[i].buildHtml());
			}
		}

		checkKeys() {
			//Check the keys and perform appropriate actions
			//D key (right)
			if (this.keyMap[68] && this.player.x < $(window).width() - 10 - this.player.width) {
				this.player.move(10,0);
			} else if (this.keyMap[65] && this.player.x > 10) {
				//A key (left)
				this.player.move(-10,0);
			} else if (this.keyMap[71] && this.playerLaser === '') {
				//G key (fire)
				this.playerLaser = new Laser(this.player.x, this.player.y, -10, 25, 10, 0, 'bullet');
				$('body').append(this.playerLaser.buildHtml());
			}
		}

		collission(x1,y1,w1,h1,x2,y2,w2,h2) {
			//Check for collissions (bounding box)
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

		manageLasers() {
			//Remove the lasers when they leave the screen
			if (this.playerLaser != '') {
				this.playerLaser.move(0,-10);
				if (this.playerLaser.y < 0) {
					this.playerLaser.die();
					this.playerLaser = '';
				}
			}
			if (this.alienLaser != '') {
				this.alienLaser.move();
				if (this.alienLaser.y > $(window).height()) {
					this.alienLaser.die();
					this.alienLaser = '';
				}
			}
		}

		manageAliens() {
			//Find the leftmost and rightmost aliens
			var highestX = 0;
			var lowestX = 0;
			for (let i = 0; i < this.aliens.length; i++) {
				if (this.aliens[i].x > this.aliens[highestX].x) {
					highestX = i;
				} else if (this.aliens[i].x < this.aliens[lowestX].x) {
					lowestX = i;
				}
			}
			//Find which direction the aliens should be going
			if (this.aliens[highestX].x > $(window).width() - this.aliens[0].width && this.alienDirection == 'right') {
				this.alienDirection = 'left';
			} else if (this.aliens[lowestX].x < 0 && this.alienDirection == 'left') {
				this.alienDirection = 'right';
			}
			//Manage the animate counter for animating the aliens by changing sprites
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
			//Loop through all aliens
			for (let i = 0; i < this.aliens.length; i++) {
				//Change the alien sprites for animation if it is time
				if (this.alienSprites[this.animateIndex] !== this.aliens[i].sprite) {
					this.aliens[i].changeImage(this.alienSprites[this.animateIndex]);
				}
				//Move the aliens based on the current direction
				if (this.alienDirection === 'right') {
					this.aliens[i].move(5 + (this.score/2),this.score / 40);
				} else {
					this.aliens[i].move(-5 - (this.score/2),this.score / 40);
				}
				//Check if the player has shot an alien
				if (this.playerLaser !== '') {
					if (this.collission(this.aliens[i].x, this.aliens[i].y, this.aliens[i].width, this.aliens[i].height,this.playerLaser.x, this.playerLaser.y, this.playerLaser.width, this.playerLaser.height)) {
						this.score ++;
						this.updateHud();
						this.aliens[i].die();
						this.aliens.splice(this.aliens.indexOf(this.aliens[i]),1);
						this.playerLaser.die();
						this.playerLaser = '';
					}
				}
			}
			//Make a random alien shoot a laser if it is time
			if (this.alienFireCooldown < this.alienFireCounter && this.alienLaser === '') {
				var randomAlien = Math.floor(Math.random() * this.aliens.length);
				this.alienLaser = new Laser(this.aliens[randomAlien].x, this.aliens[randomAlien].y, 6 + this.score, 25, 10, 0, 'alienLaser');
				$('body').append(this.alienLaser.buildHtml());
				this.alienFireCounter = 0;
			} else {
				this.alienFireCounter++;
				this.alienFireCooldown = 200 - (this.score * 4);
			}
			//Spawn more aliens if there is none left
			if (this.aliens.length < 1) {
				this.spawnAliens();
			}
		}

		gameLoop() {
			//Main game loop
			//If the player has not died yet
			if (!this.endGame) {
				game.manageLasers();
				game.checkKeys();
				game.manageAliens();
				if (this.alienLaser != '') {
					if (game.collission(game.player.x, game.player.y, game.player.width, game.player.height, game.alienLaser.x, game.alienLaser.y, game.alienLaser.width, game.alienLaser.height)) {
						game.alienLaser.die();
						game.alienLaser = '';
						game.player.lives --;
						game.updateHud();
						game.player.changeSprite();
						if (game.player.lives < 1) {
							this.endGame = true;
						}
					}
				}
				//End game if the aliens reach the bottom of the screen
				if (game.aliens[0].y > $(window).height() - game.player.height - game.aliens[0].height) {
					this.endGame = true;
				}
			//If the game has ended
			} else {
				//Stop running game loop and display the score
				clearInterval(this.interval);
				$('body').empty();
				$('body').append(`<div class="endGame"><h2>You died! Score: ${game.score}</h2></div>`);
			}
		}
	}

	//Player constructor
	class Player{
		constructor(x, y, height, width, lives, sprites) {
			this.x = x;
			this.y = y;
			this.height = height;
			this.width = width;
			this.lives = lives;
			this.sprites = sprites;
		}

		move(xMove, yMove) {
			//Function for moving the player
			this.x += xMove;
			this.y += yMove;
			$('#player').css('top', `${this.y}px`);
			$('#player').css('left', `${this.x}px`);
		}

		get html() {
			return `<div id="player"><img id="playerImg" src="${this.sprites[this.lives - 1]}" width="${this.width}" height="${this.height}"></div>`;
		}

		changeSprite() {
			//Change the player sprite if the player has been shot and is damaged
			$('#playerImg').attr('src', this.sprites[this.lives - 1]);
		}
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
		//Function for moving the laser based on it's ySpeed
		this.y += this.ySpeed;
		$("." + this.className).css("top", this.y + "px");
	}

	Laser.prototype.buildHtml = function() {
		//Build required HTML for the laser
		return "<div id=\"" + this.id + "\" class=\""+ this.className + "\" style=\"height: " + this.height + "px; width: " + this.width + "px; top: " + this.y + "px;left: " + this.x + "px;\"></div>";
	}

	Laser.prototype.die = function() {
		//Get rid of the laser when this function is called
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
		//Build required HTML for the Alien
		return "<div id=\"" + this.id + "\" class=\"alien\" style=\"height:" + this.height + "px; width: " + this.width + "top: " + this.y + "px;left: " + this.x + "px;\"><img src=\"" + this.sprite + "\" class=\"alien-img\"></div>";
	}

	Alien.prototype.changeImage = function(sprite) {
		//Change this aliens sprite to the passed in sprite
		this.sprite = sprite;
		$(".alien#" + this.id + " img").attr("src", this.sprite);
	}

	Alien.prototype.move = function(xMove, yMove) {
		//Move the alien by the provided coordinates
		this.x += xMove;
		this.y += yMove;
		$(".alien#" + this.id).css("top", this.y + "px");
		$(".alien#" + this.id).css("left", this.x + "px");
	}

	Alien.prototype.die = function() {
		//Get rid of the alien from the document
		$(".alien#" + this.id).remove();
	}

	function init() {
		//Create a new game object
		game = new Game(new Player(20, $(window).height() - 60, 50, 50, 3,["assets/player2.png","assets/player1.png","assets/player.png"]), "", [], "", ["assets/alien.png", "assets/alien1.png", "assets/alien2.png"], 0, 5,"right", 0, 200, 0, 0, 25, false, {68: false, 65: false, 71: false}, 0);
	}

	//Key handlers
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