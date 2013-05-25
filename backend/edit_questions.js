var mysql = require('mysql');
var connection = mysql.createConnection({
	host : '127.0.0.1',
	user : 'root',
	password : '',
	database : 'civil_quiz',
});

connection.connect();

function fetch_answers(question_id) {
	var sqlString = 'SELECT answers.question_id, answers.id, questions.answer_id, answers.text FROM answers, questions WHERE answers.question_id = ' + question_id + ' AND answers.id = questions.answer_id';
	connection.query(sqlString, function(err, rows, fields) {
		if (err) throw err;
		console.log('Answer: ', rows[0].text);
		connection.end();
	});
}

connection.query('SELECT * FROM questions ORDER BY RAND() LIMIT 1', function(error, rows, fields) {
	if (error) throw error;
	console.log("The solution is: ", rows[0].text);
	fetch_answers(rows[0].id);
});

