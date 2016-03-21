var socket = io();
$(document).ready(function(){
  var name = generateID();
  $('#user').val(name);
  socket.emit('Chat Message', 'System_User','<b>' + name + '</b> has joined the discussion');
  socket.emit('add user', name);
   });
   
$('#imagefile').bind('change', function(e){
      var data = e.originalEvent.target.files[0];
      var reader = new FileReader();
      reader.onload = function(evt){
        image('me', evt.target.result);
        socket.emit('user image', evt.target.result);
      };
      reader.readAsDataURL(data);
      
    });
	
	socket.on('user image', image);

function image (from, base64Image) {
    $('#messages').append('<li><b style="color:' + color + '">' + from + '</b>: ' + '<img src="' + base64Image + '"/>' + '</li>');
}

function generateID() {
  var nameID = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
 
  for( var j=0; j < 5; j++ ) {
    nameID += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return nameID;
}
function submitFunc(){
  var from = $('#user').val();
  var message = $('#m').val();
  if(message != '') {
  socket.emit('Chat Message', from, message);
}
$('#m').val('').focus();
  return false;
}
 
function showTyping() {
  var user = $('#user').val();
  socket.emit('UserNotification', user);
}
 
socket.on('Chat Message', function(from, msg){
  var me = $('#user').val();
  var color = (from == me) ? 'red' : 'violet';
  var from = (from == me) ? 'Me' : from;
  $('#messages').append('<li><b style="color:' + color + '">' + from + '</b>: ' + msg + '</li>');
});
 
socket.on('UserNotification', function(user){
  var me = $('#user').val();
  if(user != me) {
    $('#UserNotification').text(user + ' is typing ...');
  }
  setTimeout(function(){ $('#UserNotification').text(''); }, 10000);;
});

socket.on('User left', function(user){


$('#UserNotification').text(user.user + ' is disconnected');

});