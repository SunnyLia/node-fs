var moment = require("moment");
var mongodb = require("mongodb");
var MongoClient = mongodb.MongoClient;
var url = "mongodb://localhost:27017/";
var info1 = "";
exports.socket1 = function (io) {
    io.on('connection', function (socket) {
        socket.on('join', function (info) {
            info1 = info;
            socket.join(info.id); //添加到房间

            socket.broadcast.to(info.id).emit('onORout', info.user + "进入群聊");//广播给房间内其他人
            io.to(info.id).emit('chatLists', {
                code: 0, data: [{ "userName": "机器喵", "userChat": "欢迎新童鞋" + info.user + "加入群聊~" }]
            });//广播给房间所有人
        })
        socket.on('onORout', function (data) {
            socket.broadcast.to(info1.id).emit('onORout', data + "退出群聊");
        });
        socket.on('sendMsg', function (info) {
            var docs = [{
                userName: info.userName,
                userId: info.userId || (new Date()).getTime() + "",
                userChat: info.msg,
                userChatTime: dateFormat(new Date()),
                roomId: info.roomId
            }]
            io.to(info.roomId).emit('chatLists', { code: 0, data: docs });

            MongoClient.connect(url, { useUnifiedTopology: true }, function (err, client) {
                if (err) {
                    io.to(info.roomId).emit('chatLists', { code: 1, msg: err });
                }
                var db = client.db("user");
                var col = db.collection("chatLists"); //获取到chatLists表
                col.insertOne(docs[0], function (err, result) {
                    if (err) {
                        io.to(info.roomId).emit('chatLists', { code: 1, msg: err });
                    }
                    client.close();
                })
            });
        })
    });
}
const dateFormat = function (date) {
    return moment(date).format('YYYY/MM/DD HH:mm:ss');
}