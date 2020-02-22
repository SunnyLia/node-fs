const express = require("express");
const app = express();
const com = require("./views/static/common/common");

app.use(express.static('./views'))

app.set("view engine", "ejs");
app.get('/deldir',com.deldir);
app.get('/rename',com.rename);
app.get('/paste',com.paste);
app.get('/clip',com.clip);
app.all('*',com.readdir);

app.listen("8081", () => {
    console.log(`server run in 8081`)
})
