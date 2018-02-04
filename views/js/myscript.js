var socket;
function setup() {
    //socket = io.connect();
    //socket.on('connect', function (data) {
    // });
    socket = io('/chat', { transports: ['websocket'] });

    // When socket connects, get a list of chatrooms

    socket.on('join', function (roomTitle,username) {
        $('#welcomeHeading').text('Hi '+ username +'. You are in: ' + roomTitle);
    });

    socket.on('broad', function (data, sender, time) {
        $('#chattingArea').append('<div class="time">Time: ' + time + '</div>');
        $('#chattingArea').append('<div class="addedMessage">' + sender + ': ' + data + '</div>');
    });
    socket.on('myBroad', function (data, sender, time) {
        $('#chattingArea').append('<div class="time">Time: ' + time + '</div>');
        $('#chattingArea').append('<div class="myAddedMessage">' + sender + ': ' + data + '</div>');
    });

    socket.on('onlineClients', function (data) {
        $('#numberOnline').text(data - 1);
    });

    socket.on('updateOnlineUsersInRoom', function (users) {
        console.log(users);
        $('#float_right').empty();
        $('#float_right').append('<h4 class="bg-info"> Online friends in room: </h4>');
       for(var i =0;i<users.length; i++){
        $('#float_right').append('<h5><kbd>'+ (i+1) + ' - ' + users[i] +'</h5></kbd>');
       }

    });

    socket.on('signIn', function () {
        console.log('ana hena');
        alert('ana hena');
        $('#signInForm').submit();
    });

    $('#form').submit(function (e) {
        e.preventDefault();
        var message = $('#chat_input').val();
        socket.emit('messages', message);
        $('#chat_input').val('');
    });
}
setup();

function chooseRoom(roomTitle) {
    console.log(roomTitle);
    socket.emit('changeRoom', roomTitle);
}

$('#hiddenForm').submit(function (e) {
    e.preventDefault();
    var value = $('#createRoom').val();
    socket.emit('createRoom', value);
    $(this).hide();
    $('#textField').show();

});


$('#textField').on("click",function(e){
    e.preventDefault();
    $(this).hide();
    $('#hiddenForm').fadeIn();
  });
