var User            = require("../schemas/user.js");
var Room            = require("../schemas/room.js");
var roomModel       = require("../models/roomModel.js");
var routes          = require("../routes/routes.js");
var sharedsession   = require('express-socket.io-session');
var helper          = require('../helper/helper.js');
var socketIO        = require('socket.io');



var startSocketIO = function (server, session) {
    var io = socketIO(server);

    io.set('transports', ['websocket']);
    io.of('/chat').use(sharedsession(session, {
        autoSave: true
    }));

    const visitorId = '5a7058b851c8b363732b7a20';
    const defaultRoomId = '5a626c51450fc130446f733e';
    const defaultRoom = "defaultRoom";

    io.of('/chat').on('connection', newConnection);
    function newConnection(socket) {
        console.log('New connection');
        var connectedUserId = socket.handshake.session.userId;
        // if (socket.handshake.session.userId == null || socket.handshake.session.userId == undefined) {
        //     socket.handshake.session.userId = '5a7058b851c8b363732b7a20';//visitor
        //     socket.handshake.session.save();
        // }

        connectedUserId = helper.checkIfConnectedUser(connectedUserId, visitorId);

        User.findById(connectedUserId, function (err, returnedUser) {
            if (err) {
                console.log(err);
                console.log('Cannot find user by Id');
            }
            else {
                socket.username = returnedUser.username;
                socket.join(defaultRoom);
                socket.room = defaultRoom;
                socket.broadcast.to(defaultRoom).emit('onlineClients', helper.getUsersInRoomNumber(io, defaultRoom));
                socket.emit('onlineClients', helper.getUsersInRoomNumber(io, defaultRoom));
            }
        });

        Room.findById(defaultRoomId, function (err, defaultRoom) {//defaultRoomInDB
            if (err) {
                console.log(err);
            }
            else {
                //add to the room the new user if doesn't exist
                var exist = false;
                defaultRoom.users.forEach(function (user) {
                    if (user.userId == connectedUserId) {
                        exist = true;
                        console.log("Visitor, already exist in DB, please refresh browser.");
                    }
                });
                if (!exist) {
                    //console.log("Added new user to users array in room");
                    var joinedUser = { userId: connectedUserId };
                    defaultRoom.users.push(joinedUser);
                    defaultRoom.save(function () {
                        roomModel.updateOnlineFriendsInRoom(socket, socket.room);
                    });

                }
            }
        });


        //console.log('connectedUserId: '+ connectedUserId);
        User.findById(connectedUserId, function (err, returnedUser) {
            if (err) {
                console.log(err);
                console.log('Cannot find user by Id');
            }
            else {
                socket.emit('join', defaultRoom, returnedUser.username);
            }
        });


        socket.on('changeRoom', function (roomTitle) {
            var previousRoom = socket.room;
            socket.leave(previousRoom);
            roomModel.leaveRoomAndUpdateOnlineFriends(socket, previousRoom, connectedUserId);

            var newRoom = roomTitle;
            socket.join(newRoom);
            socket.room = newRoom;
            socket.emit('join', newRoom, socket.username);
            roomModel.addUserToRoomArrayAndUpdateOnlineFriends(socket, newRoom, connectedUserId);

            socket.broadcast.to(previousRoom).emit('onlineClients', helper.getUsersInRoomNumber(io, previousRoom));
            socket.emit('onlineClients', helper.getUsersInRoomNumber(io, previousRoom));

            socket.broadcast.to(newRoom).emit('onlineClients', helper.getUsersInRoomNumber(io, newRoom));
            socket.emit('onlineClients', helper.getUsersInRoomNumber(io, newRoom));
        });

        socket.on('createRoom', function (roomTitle) {
            Room.findOne({ title: roomTitle }, function (err, returnedRoom) {
                if (err) {
                    console.log(err);
                }
                else if (returnedRoom) {
                    console.log('There\'s a room with the same title.');
                } else {
                    var newRoom = { title: roomTitle };
                    Room.create(newRoom, function (err, returnedRoom) {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            console.log("Added new Room to db");
                        }
                    })
                }
            })
        });

        //io.sockets.in(socket.room).emit('event', "welcome to room 1");

        socket.on('messages', function (data) {
            socket.broadcast.to(socket.room).emit('broad', data, socket.username, helper.getDateTime());
            socket.emit('myBroad', data, 'Me', helper.getDateTime());
            // socket.broadcast.emit('broad', data);
        });

        socket.on('disconnect', function () {
            //remove user from array in room
            roomModel.leaveRoom(socket, socket.room, connectedUserId);
            socket.broadcast.to(socket.room).emit('onlineClients', helper.getUsersInRoomNumber(io, socket.room));
            socket.emit('onlineClients', helper.getUsersInRoomNumber(io, socket.room));
            // socket.handshake.session.userId={};
            // delete socket.handshake.session.userId;
            // socket.handshake.session.save();
        });
    }
}

module.exports = {
    startSocketIO
};




