const moment = require("moment");
var mongodb = require("mongodb");
var MongoClient = mongodb.MongoClient;
var url = "mongodb://localhost:27017/";

exports.socket1 = function (socket, io) {
    socket.on('join', function (info) {
        socket.join(info.id)
        // MongoClient.connect(url, { useUnifiedTopology: true }, function (err, client) {
        //     if (err) {
        //         io.to(info.id).emit('chatLists', { code: 1, msg: err });
        //     }
        //     var db = client.db("user");
        //     var col = db.collection("chatLists"); //获取到chatLists表
        //     col.find({ "roomId": info.id }).toArray((err, docs) => { //获取到所有的文档
        //         console.log(docs);

        //         if (err) {
        //             io.to(info.id).emit('chatLists', { code: 1, msg: err });
        //         } else {
        //             io.to(info.id).emit('chatLists', { code: 0, data: docs });
        //         }
        //         client.close();
        //     })
        // });
    })
    socket.on('sendMsg', function (info) {
        var docs = [{
            userName: info.userName,
            userId: info.userId || (new Date()).getTime() + "",
            userChat: info.msg,
            userChatTime: dateFormat(new Date()),
            roomId: info.roomId
        }]
        io.to(info.roomId).emit('chatLists', { code: 0, data: docs });

        // MongoClient.connect(url, { useUnifiedTopology: true }, function (err, client) {
        //     if (err) {
        //         io.to(info.roomId).emit('chatLists', { code: 1, msg: err });
        //     }
        //     var db = client.db("user");
        //     var col = db.collection("chatLists"); //获取到chatLists表
        //     col.insertOne(docs[0], function (err, result) {
        //         if (err) {
        //             io.to(info.roomId).emit('chatLists', { code: 1, msg: err });
        //         }
        //         client.close();
        //     })
        // });
    })
}
const dateFormat = function (date) {
    return moment(date).format('YYYY/MM/DD HH:mm:ss');
}