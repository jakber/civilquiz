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

module.exports = {
	addQuestionWithAnswers: function (question, answers, callback) {
		execDbQuery('INSERT INTO questions VALUES (null,?)',question, function (err, res, fields) {
                	if (err) callback('Error inserting question.', 500);
                	addAnswer(answers[0], 1, callback);
                	addAnswer(answers[1], 0, callback);
                	addAnswer(answers[2], 0, callback);
                	addAnswer(answers[3], 0, callback);
			callback('Added new question: ' + question + ', with correct answers: '     + answers[0] + ' and wrong answers: ' + answers[1] + ', ' + answers[2] + ', ' + answers[3]);
		});
	}
};

function addAnswer(res, answer, isCorrect, callback) {
	execDbQuery('INSERT INTO answers VALUES (null,?, LAST_INSERT_ID(), ?)', [answer, isCorrect], function (error, result, field) {
                        if (error) res.send('Error inserting answer', 500);
                });
}
