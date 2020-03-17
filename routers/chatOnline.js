var mongodb = require("mongodb");
var MongoClient = mongodb.MongoClient;
var url = "mongodb://localhost:27017/";

exports.getChat = function (req, res) {
    res.render("chatOnline")
}
exports.chatRoom = function (req, res) {
    res.render("chatRoom")
}