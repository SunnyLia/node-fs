var express = require("express");
var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);

var com = require("./routers");
var table = require("./routers/table");
var apiSocket = require("./routers/apiSocket");

app.use(express.static('./public'))
app.set("view engine", "ejs");

/* 在线聊天 */
app.get('/chatOnline', function (req, res) {
    res.render("chatOnline")
});

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

/* socket */
apiSocket.socket1(io)

// app.listen("8081", () => {
//     console.log(`server run in 8081`)
// })
http.listen(8081, function () {
    console.log('web socket listening on *:8081');
});


