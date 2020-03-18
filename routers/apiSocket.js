var mongodb = require("mongodb");
var MongoClient = mongodb.MongoClient;
var url = "mongodb://localhost:27017/";

exports.socket = function (socket) {

    socket.on('join', function (info) {

        MongoClient.connect(url, { useUnifiedTopology: true }, function (err, client) {
            if (err) {
                console.log(err);
                socket.emit('chatLists', { code: 1, msg: err });
            }
            var db = client.db("user");
            var col = db.collection("chatLists"); //获取到chatLists表
            
            col.find({ "roomId": info.id }).toArray((err, docs) => { //获取到所有的文档
                if (err) {
                    console.log(err);
                    socket.emit('chatLists', { code: 1, msg: err });
                } else {
                    console.log(33333333333);
                    socket.emit('chatLists', { code: 0, data: docs });
                    console.log(444444444444);
                }
                client.close();
            })
        });
    })
}