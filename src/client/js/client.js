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
       html += '<li class="list-group-items">'+ item + '</li>';
    })

    $users.html(html);
  });
});
