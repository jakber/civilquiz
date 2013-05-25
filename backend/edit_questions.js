var mysql = require('mysql');
var poolModule = require('generic-pool');
var connectionConfig = {
        host : '127.0.0.1',
        user : 'root',
        password : '',
        database : 'civil_quiz',
};
var dbPool = poolModule.Pool({
	name: 'mysql',
	create: function(callback) {
		var connection = mysql.createConnection(connectionConfig);
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

function appendAnswersAndSend(response, question) {
	var sqlString = 'SELECT DISTINCT answers.text, answers.id, answers.correct FROM answers, questions WHERE answers.question_id = ' + question.id + ' ORDER BY RAND()';
	execDbQuery(sqlString, null, function(err, res) {
		if (err) throw err;
		question.answers = res;
		response.send(question);
	});
}

var express = require('express');
var app = express();
app.use(express.static(__dirname + '/public'));
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({secret:'sea-anemone'}));
app.set('views', __dirname + '/views');

app.get('/admin', function(req, res) {
	if (!req.session.user_id) {
		res.render('admin.jade');
	} else {
		execDbQuery('SELECT * FROM questions', null, function(err, result) {
			res.render('loggedin.jade',{results : result});
		});
	}
});

app.get('/question', function(request, response) {
	sendQuestionWithAnswers(response);
});

function sendQuestionWithAnswers(response) {
	var sqlString = 'SELECT * FROM questions ORDER BY RAND() LIMIT 1';
	execDbQuery(sqlString, null, function(err, res) {
		if (err) throw err;
		appendAnswersAndSend(response, res[0]);
	});
}

function addAnswer(res, answer, isCorrect, lastid) {
	console.log('last inserted: ', lastid, lastid[0].lastid);
	execDbQuery('INSERT INTO answers VALUES (null,?, ?, ?)', [answer,lastid[0].lastid, isCorrect], function (error, result, field) {
		if (error) res.send('Error inserting answer', 500);
	})
}

app.post('/question', function (req, res) {
	execDbQuery('INSERT INTO questions VALUES (null,?)',[req.body.question], function (err, results, fields) {
		if (err) res.send('Error inserting question.', 500);
		execDbQuery('SELECT MAX(id) AS lastid FROM questions', null, function (err, resultid) {
			addAnswer(res, req.body.correctAnswer, 1, resultid);
			addAnswer(res, req.body.wrongAnswer1, 0, resultid);
			addAnswer(res, req.body.wrongAnswer2, 0, resultid);
			addAnswer(res, req.body.wrongAnswer3, 0, resultid);
			res.redirect('/admin');
		});
	});
});

app.post('/delete', function(req, res) {
	execDbQuery('DELETE FROM questions WHERE questions.id = ?', [req.body.question_id], function (err, results) {
		if (err) res.send('Error deleting question.', 500);
		execDbQuery('DELETE FROM answers WHERE answers.question_id = ?', [req.body.question_id], function (error, result) {
			if (error) res.send('Error deleting answers.', 500);
			res.json(result);
		});
	});
});

function updateAnswer(res, answer_id, newText) {
	execDbQuery('UPDATE SET text=? WHERE answers.id = ?', [answer_id], function(err, res) {
		if (err) res.send('Error updating anser with id ' + answer_id, 500);
	});
}

app.post('/update', function(req, res) {
	exeqDbQuery('UPDATE questions SET text=?', [req.body.newQuestion], function (err, results) {
		if (err) res.send('Error updating question', 500);
		updateAnswer(res, req.body.correctAnswerId);
		updateAnswer(res, req.body.wrongAnswer1Id);
		updateAnswer(res, req.body.wrongAnswer2Id);
		updateAnswer(res, req.body.wrongAnswer3Id);
	});
});

function checkAuth(req, res, next) {
  if (!req.session.user_id) {
    res.send('You are not authorized to view this page');
  } else {
    next();
  }
}

app.post('/login', function (req, res) {
	execDbQuery('SELECT * FROM admins WHERE username=? AND password=?',[req.body.username, req.body.password], function (err, results) {
		if(results.length >= 1) {
			req.session.user_id = req.body.username;
			res.redirect('/admin');
		} else {
			res.send('Bad user/password');
		}
	});
});

app.listen(3000);
console.log('Listening on port 3000');
