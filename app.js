const express = require("express");
const app = express();
const com = require("./routers");
const table = require("./routers/table");
app.use(express.static('./public'))
app.set("view engine", "ejs");
/* table列表 */
app.get('/table',table.poetry);
app.get('/query',table.query);
app.get('/addPoetry',table.addPoetry);
app.get('/editPoetry',table.editPoetry);
app.get('/delPoetry',table.delPoetry);

/* 文件操作 */
app.get('/deldir',com.deldir);
app.get('/rename',com.rename);
app.get('/paste',com.paste);
app.get('/clip',com.clip);
app.get('/addFold',com.addFold);
app.post('/upload',com.upload);
app.all('*',com.readdir);

app.listen("8081", () => {
    console.log(`server run in 8081`)
})
