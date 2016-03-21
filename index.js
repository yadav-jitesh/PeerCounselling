var app = require('express')();          
                                         
var http = require('http').Server(app);
                                             											
var io =require ('socket.io')(http);

var path = require('path');
var people = {};

//Initialize appication with path of the application
app.get('/', function(req, res){
  var express=require('express');
  app.use(express.static(path.join(__dirname)));
  res.sendFile(path.join(__dirname, '../Chat', 'arbo.html'));
});

// Socket Connection Events
io.on('connection', function(socket){
  socket.on('Chat Message', function(from, msg){
    io.emit('Chat Message', from, msg);
  });
  socket.on('user image', function (from,msg) {
        //Received an image: broadcast to all
        socket.broadcast.emit('user image', from, msg);
    });
  socket.on('UserNotification', function(user){
    io.emit('UserNotification', user);
  });
   socket.on('add user', function(user){
    socket.userName=user;
  });
  socket.on('disconnect', function (user) {
io.emit('User left', {user:socket.userName});console.log(socket.userName);
});
  
  
});

 
// Listen application request on port 3000
http.listen(3000, function(){
  console.log('listening on ***:3000');
});