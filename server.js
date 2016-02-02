var express = require('express');
var path = require('path');
var app = express();

app.use(express.static(path.join(__dirname, "./static")));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));

var server = app.listen(9000, function(){
	console.log('Fun group chat on port 9000');
});

app.get('/', function (req, res){
	res.render('index');
});

var io = require('socket.io').listen(server);

var users = [null, ''];
var messages = [];

function exists(user){
	var len = users.length;

	for(i=0; i < len; i++){
		if(user == users[i]){
			return true;
		}
	}
	return false;
};

// all socket code is nested under io connection
io.sockets.on('connection', function(socket){

	console.log('Connection good!');

	socket.on('new:user', function(data){
		console.log(data.user);
		if(exists(data.user) == true){
			socket.emit('fail', {error: 'You must enter a unique username!!!'});
		}else{
			users.push(data.user);
			socket.emit('success', {user: data.user, messages: messages});
		}
	})

	socket.on('new:message', function(data){
		messages.push(data);
		io.emit('reply:message', data);
	})

	socket.on('disconnect', function(data){
		console.log(socket.id);
	})







})

