var express = require('express'),
	path = require('path');//,
	//comments = require('./controllers/comments');


var app = module.exports = express.createServer();
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/Comment');

// Comments collection
var CommentSchema = new mongoose.Schema({
	name			: String,
	text     		: String,
	like      		: Number,
	creationDate    : Date
});

var CommentsModel = mongoose.model('Comment', CommentSchema);

app.use(express.logger());
app.use(express.bodyParser());
app.use(function(req, res, next) {
    var oneof = false;
    if(req.headers.origin) {
        res.header('Access-Control-Allow-Origin', req.headers.origin);
        oneof = true;
    }
    if(req.headers['access-control-request-method']) {
        res.header('Access-Control-Allow-Methods', req.headers['access-control-request-method']);
        oneof = true;
    }
    if(req.headers['access-control-request-headers']) {
        res.header('Access-Control-Allow-Headers', req.headers['access-control-request-headers']);
        oneof = true;
    }
    if(oneof) {
        res.header('Access-Control-Max-Age', 60 * 60 * 24 * 365);
    }

    // intercept OPTIONS method
    if (oneof && req.method == 'OPTIONS') {
        res.send(200);
    }
    else {
        next();
    }
});

app.get('/comments', function(req, res) {

	CommentsModel.find({}, function (err, comments) {
			if (err) {
				console.log('error');
			}

		//	res.type('application/json');
		    res.send(comments);
		});

});

app.post('/comments', function(req, res) {
  	var comment = new CommentsModel({
		text: req.body.name,
  		text: req.body.text,
  		like: 0,
  		creationDate: new Date()
  	});

  	comment.save(function (err, comm) {
		if (err) {
					res.send("Error saving the comment");
		}

		res.send(comm);
	});
});

app.put('/comments/:id', function(req, res) {
	CommentsModel.Comment.findById(req.params.id, function (err, comment) {
		if (err) {
			console.log('Error searching the comment...');
		}

		// Update the comment
		comment.like = req.body.like;

		// Save the modified comment
		comment.save(function (err, comm) {
			if (err) {

				res.send("Error saving the comment");
			}
			res.send(comm);
		});
	});
});

app.delete('/comments/:id', function(req, res) {
	CommentsModel.Comment.findById(req.params.id, function(err, comment) {
		comment.remove(function(err, comm) {
			if (err) {
			//	res.type('text/plain');
				res.send(500, "Error removing the comment");
			}
		//	res.type('application/json');
			res.send(200, "");
		});
	});
});

app.listen(9090, function () {
	console.log('App listening on localhost:9090');
});