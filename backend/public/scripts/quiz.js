var questions = [
	{
		id: 1,
		text: "Vad bör du elda med inomhus?",
		answers: [
			{id: "a", text: "Torr ved i lämplig storlek", correct:1},
			{id: "b", text: "Fuktig ved i lämplig storlek", correct:0},
			{id: "c", text: "Torr ved i olämplig storlek", correct:0},
			{id: "d", text: "Fuktig ved i olämplig storlek", correct:0}
		]
	},
	{
		id: 2,
		text: "Inomhustemperaturen sjunker om vi inte har tillgång till uppvärmning. I ett ordinärt välbyggt småhus med en inomhustemperatur på +21 grader tar det ett antal timmar innan inomhustemperaturen har sjunkit till  +10 grader, förutsatt att utomhustemperaturen är -10 grader. Hur lång tid tar det?",
		answers: [
			{id: 1, text: "24 timmar", correct:0},
			{id: 2, text: "36 timmar", correct:1},
			{id: 3, text: "48 timmar", correct:0},
			{id: 4, text: "60 timmar", correct:0}
		]
	}
];
var questionTemplate = Handlebars.compile($("#question-template").html());
var scoreTemplate = Handlebars.compile($("#score-template").html());
var gameOverTemplate = Handlebars.compile($("#game-over-template").html());
var currentQuestion = -1;
var game = {
	correct:0,
	wrong:0
};

$(function() {
	startGame();
});

function renderQuestion(question) {
	var body = $('#quiz-item');
	body.empty();
	body.html(questionTemplate(question));
	$('li').on('click', function(event) {
		if (game.nextQuestionTimer) return;
		var clicked = $(this);
		var answer = clicked.data("answer");
		clicked.css("background-color", "#999");
		validateAnswer(question, answer, function(res) {
			if (res.result == "correct") {
				game.correct++;
				clicked.addClass("green");
				$("#audio-cheer").get(0).play();
				$("#flash").html("")
			} else {
				clicked.addClass("red")
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
	$(".bar div").animate({width:0}, 60000, gameOver);
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
	$.getJSON("/question", function(data) {
		renderQuestion(data);
	});
	//currentQuestion = (currentQuestion+1)%questions.length;
	
}

function gameOver() {
	clearTimeout(game.nextQuestionTimer);
	delete game.nextQuestionTimer;
	game.score = game.correct - game.wrong;
	var body = $('#quiz-item');
	body.empty();
	body.html(gameOverTemplate(game));
	$("#playagain").on("click", startGame);
}
