$(function() {
	startGame();
});

var questionTemplate = Handlebars.compile($("#question-template").html());
var scoreTemplate = Handlebars.compile($("#score-template").html());
var gameOverTemplate = Handlebars.compile($("#game-over-template").html());
var game = {
	correct:0,
	wrong:0
};


function renderQuestion(question) {
	var body = $('#wrapper');
	body.empty();
	body.html(questionTemplate(question));
	$('#quiz li').on('click', function(event) {
		if (game.nextQuestionTimer) return;
		var clicked = $(this);
		var answer = clicked.data("answer");
		clicked.css("background-color", "#999");
		validateAnswer(question, answer, function(res) {
			if (res.result == "correct") {
				game.correct++;
				clicked.addClass("green");
				$("#audio-cheer").get(0).play();
                $("#answerdiv-" + answer).addClass("flash");
				$("#flash").html("")
			} else {
				clicked.addClass("red")
                $("#answerdiv-" + answer).addClass("shake");
				$("#answer-" + res.correct).addClass("green");
				$("#audio-fail").get(0).play();
				game.wrong++;
			}
			//$("#flash").css("display", "inline-block");
			game.nextQuestionTimer = setTimeout(nextQuestion, 2000);
		});
	});
} 

function startGame() {
	game = {
		time:60.0,
		correct:0,
		wrong:0
	};

	renderScore();
	$(".bar div").animate({width:0}, 60000, "linear", gameOver);
	nextQuestion();
}

function tick() {
	game.time -= 0.5;
	if (game.time <= 0) 
		gameOver();
	var width = (game.time/60) * 100;
	$(".bar div").css("width", "" + width + "%");
	setTimeout(tick, 500)
}

function renderScore() {
	var body = $('#score');
	body.empty();
	body.html(scoreTemplate(game));
}

function validateAnswer(question, answer, callback) {	
	var correct = _.find(question.answers, function(a) {return a.correct == 1});
	if (answer == correct.id) {
		callback({result:"correct"});
	} else {
		callback({result:"wrong", correct:correct.id});
	}
}

function nextQuestion() {
	delete game.nextQuestionTimer;
	getQuestion(renderQuestion);
}

function gameOver() {
	clearTimeout(game.nextQuestionTimer);
	delete game.nextQuestionTimer;
	game.score = game.correct - game.wrong;
	var body = $('#wrapper');
	body.empty();
	body.html(gameOverTemplate(game));
	$("#playagain").on("click", startGame);
}


var currentQuestion = Math.floor(Math.random()*questions.length);

var getQuestionFile = function(callback) {
	currentQuestion = (currentQuestion+1)%questions.length;	
	callback(questions[currentQuestion]);
}

var getQuestionDatabase = function(callback) {
	$.getJSON("/question", function(data) {
		callback(data);
	});
}
