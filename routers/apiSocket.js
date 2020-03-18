const moment = require("moment");
var mongodb = require("mongodb");
var MongoClient = mongodb.MongoClient;
var url = "mongodb://localhost:27017/";

exports.socket = function (socket) {
    socket.on('join', function (info) {
        MongoClient.connect(url, { useUnifiedTopology: true }, function (err, client) {
            if (err) {
                socket.emit('chatLists', { code: 1, msg: err });
            }
            var db = client.db("user");
            var col = db.collection("chatLists"); //获取到chatLists表
            col.find({ "roomId": info.id }).toArray((err, docs) => { //获取到所有的文档
                if (err) {
                    socket.emit('chatLists', { code: 1, msg: err });
                } else {
                    socket.emit('chatLists', { code: 0, data: docs });
                }
                client.close();
            })
        });
    })
    socket.on('sendMsg', function (info) {
        var docs = [{
            userName: info.userName,
            userId: info.userId || (new Date()).getTime(),
            userChat: info.msg,
            userChatTime: dateFormat(new Date()),
            roomId: info.roomId
        }]
        socket.emit('chatLists', { code: 0, data: docs });
    })
}
const dateFormat = function (date) {
    return moment(date).format('YYYY/MM/DD HH:mm:ss');
}