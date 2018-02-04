var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/chat_app", { useMongoClient: true });

var userSchema = new mongoose.Schema({
    title: { type: String, required: true, index: { unique: true } },
    users: { type: [{ userId: String}]}
});

module.exports = mongoose.model("Room", userSchema);