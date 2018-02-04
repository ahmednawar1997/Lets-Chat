var Room = require("../schemas/room.js");
var User = require("../schemas/user.js");

function clearOnlineUsersArrayInRooms() {
    Room.update({}, { $set: { users: [] } }, { multi: true }, function (err, affected) {
    });
}


function updateOnlineFriendsInRoom(socket, currentRoom) {
    Room.findOne({ 'title': currentRoom }, function (err, room) {
        var usersNames = [];
        if (err) {
            return console.log(err);
        }
        room.users.forEach(function (user) {
            User.findById(user.userId, function (err, finalUser) {
                //console.log('final user: '+finalUser.username);
                usersNames.push(finalUser.username);
                socket.broadcast.to(currentRoom).emit("updateOnlineUsersInRoom", usersNames);
                socket.emit('updateOnlineUsersInRoom', usersNames);
            })
        });


    });
}

function addUserToRoomArrayAndUpdateOnlineFriends(socket, currentRoomTitle, connectedUserId) {

    Room.findOne({ 'title': currentRoomTitle }, function (err, returnedRoom) {
        if (err) {
            console.log(err);
        }
        else {
            //add to the room the new user if doesn't exist
            var exist = false;
            returnedRoom.users.forEach(function (user) {
                if (user.userId == connectedUserId) {
                    exist = true;
                    console.log("already exist");
                }
            });
            if (!exist) {
                var joinedUser = { userId: connectedUserId };
                returnedRoom.users.push(joinedUser);
                returnedRoom.save(function () {
                    updateOnlineFriendsInRoom(socket, currentRoomTitle);
                });
            }
        }
    });
}

function leaveRoom(socket, roomToLeave, userId) {
    Room.update({ title: roomToLeave }, { "$pull": { "users": { "userId": userId } } }, { safe: true, multi: true }, function (err, returnedUser) {
        if (err) { console.log(err); }
        else {
            //console.log('removed');
        }
    });
}


function leaveRoomAndUpdateOnlineFriends(socket, roomToLeave, userId) {
    Room.update({ title: roomToLeave }, { "$pull": { "users": { "userId": userId } } }, { safe: true, multi: true }, function (err, returnedUser) {
        if (err) { console.log(err); }
        else {
            updateOnlineFriendsInRoom(socket, roomToLeave);
        }
    });
}


module.exports = {
    leaveRoomAndUpdateOnlineFriends,
    leaveRoom,
    addUserToRoomArrayAndUpdateOnlineFriends,
    updateOnlineFriendsInRoom,
    clearOnlineUsersArrayInRooms
};

