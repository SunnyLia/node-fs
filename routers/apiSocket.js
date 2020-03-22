var moment = require("moment");
var mongodb = require("mongodb");
var MongoClient = mongodb.MongoClient;
var url = "mongodb://localhost:27017/";
var userList = {};
exports.socket1 = function (io) {
    io.on('connection', function (socket) {
        var info1 = {};
        socket.on('join', function (info, fn) {
            info1 = info;
            userList[info.user] = socket.id; //把用户socketid存到以用户为属性的list对象里
            
            if (info.id.indexOf("single") == -1) {
                socket.join(info.id); //添加到房间

                if (socket.adapter.rooms[info.id]) {
                    info1["count"] = socket.adapter.rooms[info.id].length;
                }

                fn(info1.count);//客户端回调

                socket.broadcast.to(info.id).emit('inORout', { msg: info.user + "进入群聊", count: info1.count });//广播给房间内其他人
                io.to(info.id).emit('chatLists', {
                    code: 0, data: [{ "userName": "机器喵", "userChat": "欢迎" + info.user + "童鞋加入群聊~" }]
                });//广播给房间所有人
            }
        })

        socket.on('disconnect', async function () {
            if (info1.id.indexOf("single") == -1) {
                if (socket.adapter.rooms[info1.id]) {
                    info1["count"] = socket.adapter.rooms[info1.id].length;
                }
                socket.broadcast.to(info1.id).emit('inORout', { msg: info1.user + "退出群聊", count: info1.count });
            }
        })
        socket.on('sendMsg', function (info) {
            var docs = [{
                userName: info.userName,
                // userId: info.userId || (new Date()).getTime() + "",
                userChat: info.msg,
                userChatTime: dateFormat(new Date()),
                roomId: info.roomId
            }]

            if (info1.id.indexOf("single") == -1) {
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
            } else {
                io.to(userList[info.userName]).emit('chatLists', { code: 0, data: docs });
                // var msg = "呜呜呜，我只会加减乘除，试试问我1+2-3*4/5吧"
                // try {
                //     msg = eval(docs[0].userChat);
                // } catch (err) { }
                // io.to(socket.id).emit('chatLists', {
                //     code: 0, data:
                //         [{ "userName": "机器喵", "userChat": msg }]
                // });
            }
        })
    });
}
const dateFormat = function (date) {
    return moment(date).format('YYYY/MM/DD HH:mm:ss');
}