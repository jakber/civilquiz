var mysql = require('mysql');
var connection = mysql.createConnection({
	host : '127.0.0.1',
	user : 'root',
	password : '',
	database : 'civil_quiz',
});

connection.connect();

connection.query('SELECT * FROM questions ORDER BY RAND() LIMIT 1', function(error, rows, fields) {
	if (error) throw error;
	console.log("The solution is: ", rows[0].text);
});

connection.end();
