var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/chat_app", { useMongoClient: true });

var userSchema = new mongoose.Schema({
    username: { type: String, required: true, index: { unique: true }},
    password: { type: String, required: true }
});

module.exports = mongoose.model("User", userSchema);

// var user = new User({
//     username: "john",
//     password: "1234"
// });

// user.save(function(err, user){
//     if(err){
//         console.log("User not saved in DB");
//     }
//     else{
//         console.log("User saved to DB.");
//         console.log(user);
//     }
// });

// User.find({}, function(err,users){
//     if(err){
//         console.log(err);
//     }else{
//         console.log(users);
//     }
// });

// User.create({
//     username: "sansa",
//     password: "1234"
// }, function (err, returnedUser) {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log(returnedUser);
//     }
// });