const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");

app.use(express.static('./views'))

app.set("view engine", "ejs");

app.all('*', function (req, res) {
    var path1 = decodeURI(req.path);
    fs.readdir("./views/static" + path1, function (err, files) {
        const allFold = [];
        if (err) {
            res.render("error")
            return
        }
        files.forEach(function (file) {
            let stats = fs.statSync("./views/static" + path1 + file);
            allFold.push({
                isFold: stats.isDirectory(),
                foldName: file,
                type: path.extname(file),
                dir: path1 + file
            })
        })
        // res.send({ data: allFold })
        res.render("index", { foldLists: allFold, breadcrumbs: path1.split("/") })
    })

});

app.listen("8081", () => {
    console.log(`server run in 8081`)
})