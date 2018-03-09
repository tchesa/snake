// class to represent an ordered pair
var pair = class pair {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
	translate(x,y) {
		this.x += x;
		this.y += y;
	}
};

var dir = 'r'; // initial direction (r, l, u, d)
var nextDir = 'r';

// board/display config
pieceSize = 32; // in px
tabSize = new pair(10,20);

var snake; // array of pairs
var fruit; // :pair; fruit position
var level = 1; // initial level
var speed = 800; // initial speed (in ms)

var score = 0; // current score
var hiscore = localStorage.getItem("hiscore") | 0; // hiscore is saved on localstorage

// view setup
$("#table").css("width", pieceSize*tabSize.x).css("height", pieceSize*tabSize.y);
$("#board").css("height", pieceSize*tabSize.y);

// renders the snake
function render() {
    $("#snake").find(".piece").remove();
    for (var i = 0; i < snake.length; i++) {
        $("<img>", {
            'class': "piece",
            css: {
                "left": snake[i].x*pieceSize,
                "top": snake[i].y*pieceSize
            },
            src: "/snake/img/dark.png"
        }).appendTo($("#snake"));
    }
}

// instantiate another fruit
function nextFruit() {
	$("#fruit").remove();
	var collision;
	do {
		collision = false;
		fruit = new pair(Math.floor((Math.random()*tabSize.x)), Math.floor((Math.random()*tabSize.y))); // generate next fruit position
		for (var i = 0; !collision && i < snake.length; i++) { // check if next fruit position is in the snake
			collision = (fruit.x == snake[i].x && fruit.y == snake[i].y);
		}
	} while (collision); // while the next position is valid

	// create fruit element
	$("<img>", {
		"id": "fruit",
		css: {
			"left": fruit.x*pieceSize,
			"top": fruit.y*pieceSize
		},
		src: "/snake/img/dark.png"
	}).appendTo($("#table"));
}

// movement function
function move() {
	// get new snake fragment position
	var next = new pair(snake[0].x, snake[0].y);
	dir = nextDir;
	switch (dir) {
		case 'r': next.translate(1,0); break;
		case 'l': next.translate(-1,0); break;
		case 'u': next.translate(0, -1); break;
		case 'd': next.translate(0, 1); break;
		default: break;
	}
	next.x = (next.x+tabSize.x)%tabSize.x;
	next.y = (next.y+tabSize.y)%tabSize.y;

	if (next.x == fruit.x && next.y == fruit.y) { // take fruit
		score++; // increment score
		$("#score").text(formatScore(score));
		if (score > hiscore) { // updates the hiscore
			hiscore = score;
			localStorage.setItem("hiscore", hiscore);
			$("#hi-score").text(formatScore(hiscore));
		}

		// updates the level
		level = Math.floor(score/5)+1;
		$("#level").text(level);

		nextFruit(); // instantiate another fruit
	} else {
		snake.pop(); // removes the last snake fragment
	}

	// detect colision
	var collision = false;
	for (var i = 0; !collision && i < snake.length; i++) {
		if (next.x == snake[i].x && next.y == snake[i].y) {
			collision = true;
		}
	}

	snake.unshift(next); // add the new snake fragment
	
	render(); // updates snake render
	if(collision) { // game over
		$("#gameover").css("color", "black");
		$("#start").prop("disabled", false);
	} else {
		setTimeout(move, speed/level); // next movement step
	}
}

// reset game
function init () {
	snake = [new pair(Math.floor(tabSize.x/2.), Math.floor(tabSize.y/2.))];
	nextFruit();
	render();
	score = (snake.length-1);
	$("#score").text(formatScore(score));
	$("#start").prop("disabled", true);
	$("#gameover").css("color", "#63796b");
	dir = 'r';
	nextDir = 'r';
	level = 1;
	$("#level").text(level);
	setTimeout(move, speed/level);
}

// format score text
function formatScore (value) {
	var size = 6;
	str = value.toString();
	for (var i = 0; i < size-value.toString().length; i++) {
		str = "0"+str;
	}
	return str;
}

// init labels
$("#hi-score").text(formatScore(hiscore));
$("#score").text(formatScore(score));
$("#level").text(level);

// movement event listener
document.addEventListener('keydown', function(event) {
	switch (event.keyCode) {
		case 38: if (dir != 'd') nextDir = 'u'; break;
		case 87: if (dir != 'd') nextDir = 'u'; break;
		case 40: if (dir != 'u') nextDir = 'd'; break;
		case 83: if (dir != 'u') nextDir = 'd'; break;
		case 39: if (dir != 'l') nextDir = 'r'; break;
		case 68: if (dir != 'l') nextDir = 'r'; break;
		case 37: if (dir != 'r') nextDir = 'l'; break;
		case 65: if (dir != 'r') nextDir = 'l'; break;
		default: break;
	}
});