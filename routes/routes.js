var express = require('express');
var routes = express.Router();
var User = require("../schemas/user.js");
var Room = require("../schemas/room.js");
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/chat_app", { useMongoClient: true });

routes.get('/', function (req, res) {
    res.render('index.ejs');
});
routes.get('/chat', function (req, res) {
    console.log('Session Id: ' + req.session.userId);
    if (req.session.userId == null || req.session.userId == undefined) {
        res.redirect('/signin');
    } else {
        var rooms = [];
        Room.find({}, function (err, returnedRooms) {
            if (err) {
                console.log(err);
            }
            else if (!returnedRooms) {
                console.log("no returned rooms");
            } else {
                res.render('chat.ejs', { rooms: returnedRooms });
            }
        });     
    }
});
routes.get('/signup', function (req, res) {
    res.render(__dirname + 'signup.ejs');
});
routes.post('/signup', function (req, res) {
    var username = req.body.username;
    var password = req.body.pwd;

    var newUser = { username: username, password: password };
    User.create(newUser, function (err, newUser) {
        if (err) {
            console.log(err);
            res.redirect('/signup');
        }
        else {
            console.log('in signup:' + req.session.userId);
            req.session.userId = newUser._id;
            console.log("Added new User to db");
            res.redirect('/chat');
        }
    })
});
routes.get('/signin', function (req, res) {
    res.render('signin.ejs');
});
routes.post('/signin', function (req, res) {
    var username = req.body.username;
    var password = req.body.pwd;

    User.findOne({ username: username }, function (err, returnedUser) {
        if (err) {
            console.log(err);
            res.redirect('/signin');
        }
        else if (!returnedUser) {
            res.redirect('/signin');
            console.log("no returned user");
        } else {
            if (returnedUser.password == password) {
                req.session.userId = returnedUser._id;
                console.log("Signed in");
                res.redirect('/chat');
            }
            else {
                console.log("Wrong Password!");
                res.redirect('/signin');
            }
        }
    });
});

routes.get('/logout', function (req, res) {
    req.session.destroy();
    res.redirect('/');
});


module.exports = routes;