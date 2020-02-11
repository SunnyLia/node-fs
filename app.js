const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");

app.use(express.static('./view'))

// app.get("/", function (req, res) {
//     res.sendFile(path.resolve(__dirname, "./view/index.html"));
// })

//这是获取文件列表的统一接口
app.get('/index.htm', (req, res) => {
    var dir =  req.query.dir;

    fs.readdir("./view/static"+dir, function (err, files) {
        const allFold = []
        if (err) {
            res.send({ data: null })
            return
        }
        files.forEach(function (file) {
            try {
                let stats = fs.statSync("./view/static"+dir+ file)
                allFold.push({
                    isFold: stats.isDirectory(),
                    foldName: file,
                    type: path.extname(file),
                    dir: dir + file 
                })
            } catch (err) {
                console.error(`ERROR: read fold ${dir} `)
            }
        });
        res.send({ data: allFold })
    });
})
app.get("/:name", function (req, res) {
    res.sendFile(path.resolve(__dirname, "./view/index.html"));
})
app.get("/:name/:name", function (req, res) {
    res.sendFile(path.resolve(__dirname, "./view/index.html"));
})

app.listen("8081", () => {
    console.log(`server run in 8081`)
})