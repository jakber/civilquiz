var questions = [
	{
		question: "Vad bör du elda med inomhus?",
		answers: [
			{answer: "a", text: "Torr ved i lämplig storlek"},
			{answer: "b", text: "Fuktig ved i lämplig storlek"},
			{answer: "c", text: "Torr ved i olämplig storlek"},
			{answer: "d", text: "Torr ved i lämplig storlek"}
		],
		correct:"a"
	},
	{
		question: "Inomhustemperaturen sjunker om vi inte har tillgång till uppvärmning. I ett ordinärt välbyggt småhus med en inomhustemperatur på +21 grader tar det ett antal timmar innan inomhustemperaturen har sjunkit till  +10 grader, förutsatt att utomhustemperaturen är -10 grader. Hur lång tid tar det?",
		answers: [
			{answer: "a", text: "24 timmar"},
			{answer: "b", text: "36 timmar"},
			{answer: "c", text: "48 timmar"},
			{answer: "d", text: "60 timmar"}
		],
		correct: "b"
	}
];
var questionTemplate = Handlebars.compile($("#question-template").html());
var scoreTemplate = Handlebars.compile($("#score-template").html());
var currentQuestion = -1;
var game = {
	correct:0,
	wrong:0
};

$(function() {
	startGame();
	nextQuestion();
});

function renderQuestion(question) {
	var body = $('#quiz-item');
	body.empty();
	body.html(questionTemplate(question));
	$('li').on('click', function(event) {
		var clicked = $(this);
		var answer = clicked.data("answer");
		clicked.css("background-color", "#999");
		validateAnswer(question, answer, function(res) {
			if (res.result == "correct") {
				game.correct++;
				clicked.css("background-color", "#6f3");
				$("#audio-cheer").get(0).play();
				$("#flash").html("")
				$("#flash").html("Rätt")
			} else {
				clicked.css("background-color", "#c30");
				console.log(res)
				$("#answer-" + res.correct).css("background-color", "#6f3");
				$("#audio-fail").get(0).play();
				$("#flash").html("Fel")
				game.wrong++;
			}
			//$("#flash").css("display", "inline-block");
			renderScore();
			setTimeout(nextQuestion, 2000);
		});
	});
} 

function startGame() {
game = {
	time:60,
	correct:0,
	wrong:0
};
nextQuestion();

}

function renderScore() {
	var body = $('#score');
	body.empty();
	body.html(scoreTemplate(score));
}

function validateAnswer(question, answer, callback) {
	if (answer == question.correct) {
		callback({result:"correct"});
	} else {
		callback({result:"wrong", correct:question.correct});
	}
}

function nextQuestion() {
	currentQuestion = (currentQuestion+1)%questions.length;
	renderQuestion(questions[currentQuestion]);
}
