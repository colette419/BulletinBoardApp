var express = require('express');
var app = express();
var pg = require('pg');
var bodyParser = require('body-parser');
var connectionString = 'postgres://' + process.env.POSTGRES_USER + ':' + '@localhost/bulletinboard';


app.use(express.static('public/css'));
app.use(bodyParser.urlencoded({
	extended: true
}));



app.set('view engine', 'jade');
app.set('views', './public/views');


app.get('/', function(req, res) {
	res.render('form');
});

app.post('/', function(request, response) { //page to add a blog post
	var blogBody = request.body.blogBody;
	var blogTitle = request.body.blogTitle;
	console.log(blogTitle);
	console.log(blogBody);
	if (blogTitle.length !== 0 || blogBody.length !== 0) {
		pg.connect(connectionString, function(err, client, done) {
			client.query('insert into messages (postTitle, postBody) values ($1, $2)', [blogTitle, blogBody], function(err) {
				if (err) {
					console.log(err);
				}
				done();
				pg.end();
			});
		});
		response.render('successPage');
	} else {
		response.send("You must enter both a Title and a Message in order to post.");
	}
});

app.get('/posts', function(req, res) { //when you go to /posts, do the pg connect function that will select the messages
	var iMessage = {};
	pg.connect(connectionString, function(err, client, done) { // connect to the database
		if (err) {
			console.log(err);
		}; // if there's an error, console.log an error
		client.query('select * from messages', function(err, result) {
			iMessage = result.rows;
			done();
			pg.end();
			console.log(iMessage);
			res.render('users', {
				Messages: iMessage
			}); //send iMessage data to the jade file to be rendered
		});
	});
});



app.listen(3000, function() {
	console.log('Example app listening on port 3000!');
});