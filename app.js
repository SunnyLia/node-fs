var express = require("express");
var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);

var com = require("./routers");
var table = require("./routers/table");
var chatOnline = require("./routers/chatOnline");
var apiSocket = require("./routers/apiSocket");

app.use(express.static('./public'))
app.set("view engine", "ejs");

/* 在线聊天 */
app.get('/chatOnline', chatOnline.getChat);
app.get('/chatRoom.htm', chatOnline.chatRoom);

/* table列表 */
app.get('/table', table.poetry);
app.get('/query', table.query);
app.get('/addPoetry', table.addPoetry);
app.get('/editPoetry', table.editPoetry);
app.get('/delPoetry', table.delPoetry);

/* 文件操作 */
app.get('/deldir', com.deldir);
app.get('/rename', com.rename);
app.get('/paste', com.paste);
app.get('/clip', com.clip);
app.get('/addFold', com.addFold);
app.post('/upload', com.upload);
app.all('*', com.readdir);

// app.listen("8081", () => {
//     console.log(`server run in 8081`)
// })
http.listen(8081, function () {
    console.log('web socket listening on *:8081');
});

io.on('connection', function (socket) {
    console.log('a user connected');
    socket.on('disconnect', function () {
        console.log('a user disconnected');
    });
    apiSocket.socket1(socket,io)
});
