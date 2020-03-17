var mongodb = require("mongodb");
var MongoClient = mongodb.MongoClient;
var url = "mongodb://localhost:27017/";

exports.socket = function (socket) {
    //新用户链接，进行推送
    socket.on('join', function (info) {
        console.log(info);
        
    })
}