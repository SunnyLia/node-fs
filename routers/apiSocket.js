var moment = require("moment");
var mongodb = require("mongodb");
var MongoClient = mongodb.MongoClient;
var url = "mongodb://localhost:27017/";
var userList = {};
exports.socket1 = function (io) {
    io.on('connection', function (socket) {
        // console.log("用户上线");
        var info1 = {}; //保存roomId,user,count
        /* 登陆 login */
        socket.on('login', function (info) {
            userList[info.user] = socket.id; //把用户socketid存到以用户为属性的userList对象里
        })
        /* 加入群聊 join */
        socket.on('join', function (info, fn) {
            info1 = info;
            socket.join(info.roomId); //添加到房间
            if (info.roomId && info.roomId.indexOf("single") == -1) {
                if (socket.adapter.rooms[info.roomId]) {
                    info1["count"] = socket.adapter.rooms[info.roomId].length;
                }
                fn(info1.count);//客户端回调
                socket.broadcast.to(info1.roomId).emit('inORout', { msg: info1.user + "进入群聊", count: info1.count });//发送给房间内其他人

                // 向数据库请求原始消息
                MongoClient.connect(url, { useUnifiedTopology: true }, function (err, client) {
                    if (err) io.to(info1.roomId).emit('chatLists', { code: 1, msg: err });
                    var db = client.db("user");
                    var col = db.collection("chatLists");
                    col.find({ "roomId": info1.roomId }).toArray((err, docs) => {
                        if (err) {
                            io.to(info1.roomId).emit('chatLists', { code: 1, msg: err }); //发送给房间所有人
                        } else {
                            io.to(socket.id).emit('oldChat', { code: 0, data: docs }); //只发送给请求的那个人
                        }

                        io.to(info1.roomId).emit('chatLists', {
                            code: 0, data: [{ "userName": "机器喵", "userChat": "欢迎" + info1.user + "童鞋加入群聊~" }]
                        });//发送给房间所有人
                        client.close();
                    })
                });
            }
        })

        /* 进入退出 */
        socket.on('inORout', function (info) {
            socket.leave(info1.roomId) //退出聊天室
            if (info1.roomId && info1.roomId.indexOf("single") == -1) {
                if (socket.adapter.rooms[info1.roomId]) {
                    info1["count"] = socket.adapter.rooms[info1.roomId].length;
                }
                socket.broadcast.to(info1.roomId).emit('inORout', { msg: info1.user + "退出群聊", count: info1.count - 1 });
            }
        })
        /* 消息监测 */
        socket.on('sendMsg', function (info) {
            var docs = [{
                userName: info.userName,
                userChat: info.msg,
                userChatTime: dateFormat(new Date()),
                roomId: info.roomId
            }]
            console.log(info.roomId);
            console.log(info1.roomId);
            // 这里是群聊
            if (info1.roomId && info1.roomId.indexOf("single") == -1) {
                io.to(info1.roomId).emit('chatLists', { code: 0, data: docs }); //发送给房间所有人

                MongoClient.connect(url, { useUnifiedTopology: true }, function (err, client) {
                    if (err) io.to(info.roomId).emit('chatLists', { code: 1, msg: err });
                    var db = client.db("user");
                    var col = db.collection("chatLists");
                    col.insertOne(docs[0], function (err, result) {
                        if (err) io.to(info.roomId).emit('chatLists', { code: 1, msg: err });
                        client.close();
                    })
                });
            } else { //这是单聊

                if (!userList[info.toWho]) { //用户未登陆，提示
                    io.to(socket.id).emit('chatLists', { code: 2, data: docs, msg: "当前用户不在线" }); //给请求人发消息
                } else {
                    console.log(socket);
                    console.log(socket.adapter.rooms);
                    
                    if (!socket.adapter.rooms[info.roomId].sockets[userList[info.toWho]]) { //用户不在当前聊天室
                        io.to(userList[info.toWho]).emit('openNewPage', { roomId: info.roomId, roomName: info.userName, msg: docs });
                    } else {
                        io.to(userList[info.toWho]).emit('chatLists', { code: 0, data: docs });
                    }
                }
                io.to(socket.id).emit('chatLists', { code: 0, data: docs });

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
        socket.on('disconnect', async function () {
            // console.log("用户下线");
            socket.leave(info1.roomId) //退出聊天室
            if (info1.roomId && info1.roomId.indexOf("single") == -1) {
                if (socket.adapter.rooms[info1.roomId]) {
                    info1["count"] = socket.adapter.rooms[info1.roomId].length;
                }
                socket.broadcast.to(info1.roomId).emit('inORout', { msg: info1.user + "退出群聊", count: info1.count });
            }
        })
    });
}
const dateFormat = function (date) {
    return moment(date).format('YYYY/MM/DD HH:mm:ss');
}


// socket.client.conn.server//里面有客户端总数
// socket.client.conn.server.clients//里面为各客户的socketid
// socket.client.server.sockets.socket//里面为各客户端socketid对象
// socket.client.sockets //为当前客户端socketid对象
// socket.rooms//里面为当前客户的socketid及去过的roomid
// socket.server.sockets.connected//里面有连接过的socketid对象