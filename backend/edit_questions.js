var mysql = require('mysql');
var poolModule = require('generic-pool');
var connection = mysql.createConnection({
	host : '127.0.0.1',
	user : 'root',
	password : '',
	database : 'civil_quiz',
});

var dbPool = poolModule.Pool({
	name: 'mysql',
	create: function(callback) {
		connection.connect();
		connection.on('error', function(err) {
			if (!err.fatal) {
		      return;
		    }
		    if (err.code !== 'PROTOCOL_CONNECTION_LOST') {
		      throw err;
		    }
			dbPool.destroy(connection);
			console.log("Removed erroneous connection from pool.");
		});
		callback(null, connection);
	},	
	destroy: function(connection){ connection.end();},
	max: 4,
	idleTimeoutMillis: 30000
});

function bitToBoolean(field, next) {
	if (field.type == "BIT") {
		return (field.buffer()[0] == 1);
	}
	return next();
}
function execDbQuery(query,params,queryCallback) {
	dbPool.acquire(function(err, client) {			
		if(err) {
			console.log("Error while acquiring db resource");
		} else {
			client.query({"sql": query, "typeCast": bitToBoolean, "values":params}, function selectCb(err, results, fields) {
				dbPool.release(client);
				queryCallback(err, results, fields);
			});
		}	
	});
}

function fetch_answers(question_id) {
	var sqlString = 'SELECT answers.question_id, answers.id, questions.answer_id, answers.text FROM answers, questions WHERE answers.question_id = ' + question_id;
	execDbQuery(sqlString, null, function(err, res) {
		if (err) throw err;
		console.log('Answer: ', res[0].text);
	});
}

var express = require('express');
var app = express();
app.get('/question', function(request, response) {
	fetchQuestion();
});

function fetchQuestion() {
	var sqlString = 'SELECT * FROM questions ORDER BY RAND() LIMIT 1';
	execDbQuery(sqlString, null, function(err, res) {
		if (err) throw err;
		console.log("Question: ", res[0].text);
		fetch_answers(res[0].id);
	});
}
fetchQuestion();
