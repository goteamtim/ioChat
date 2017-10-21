import io from 'socket.io-client';
import $ from 'jquery';

$(document).ready(function() {
  let socket = io.connect();
  let $messageForm = $('#messageForm');
  let $message = $('#message');
  let $chat = $('#chat');
  let $userFormArea = $('#userFormArea');
  let $userForm = $('#userForm');
  let $messageArea = $('#messageArea');
  let $users = $('#users');
  let $username = $('#username');

  $messageForm.submit((e) => {
    e.preventDefault();
    socket.emit('send message', $message.val());
    $message.val('');
  });

  socket.on('new message', (data) => {
    $chat.append('<div class="well"> <strong> ' + data.user + '</strong>: ' + data.msg + '</div>')
  });

  $userForm.submit((e) => {
    e.preventDefault();
    socket.emit('new user', $username.val(), (data) => {
      if (data) {
        $userFormArea.hide();
        $messageArea.show();
      } 
    });
    $username.val('');
  });

  socket.on('get users', (data) => {
    let html = '';

    data.forEach((item) => {
       html += '<li class="list-group-items" data-user="' + item + '">'+ item + '</li>';
    })

    $users.html(html);
  });

  window.onkeyup = function(e) {
    socket.emit("typing")
  }

  window.onkeydown = function(e) {
    socket.emit("typing")
  }

  socket.on("typing",(data)=>{
  if(true/*!your username*/){
    showTypingAlert(data.user);
  }
  });

});

function showTypingAlert(username){
  //If its not their username then show the box for one second?
  //var d = document.querySelector('li[data-user="' + username + '"]');
  $('li[data-user="' + username + '"]').addClass('typing');
  //d.style.addClass('typing');
  setTimeout(function(){
    $('li[data-user="' + username + '"]').removeClass('typing')
  },750);
}