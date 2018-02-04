var checkIfConnectedUser = function (connectedUserId, visitorId) {
    if (!connectedUserId) {
        return visitorId;
    }
    return connectedUserId;
}

var getUsersInRoomNumber = function (io, roomName) {
    var users = 0;
    users = io.nsps['/chat'].adapter.rooms[roomName];
    if (users) return users.length;
    else return 0;
}

var getDateTime = function () {
    var date = new Date();
    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;
    var min = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;
    var sec = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;
    var day = date.getDate();
    day = (day < 10 ? "0" : "") + day;
    return hour + ":" + min + ":" + sec;
}

module.exports = { 
    getDateTime,
    getUsersInRoomNumber,
    checkIfConnectedUser
};


// var array=[];
// returnedRooms.forEach(function(room){
//     room.users.forEach(function(user){
//        array.push(user.userId);//get userIDs in all the rooms
//     })
    
// });

// if(io.sockets.adapter.rooms[defaultRoom]){
//     console.log("YESSSS");
// }


 //io.sockets.emit('onlineClients', clients);

//  function findRooms() {
//     var availableRooms = [];
//     var rooms = io.sockets.adapter.rooms;
//     if (rooms) {
//         for (var room in rooms) {
//             if (!rooms[room].hasOwnProperty(room)) {
//                 availableRooms.push(room);
//             }
//         }
//     }
//     return availableRooms;
// }
