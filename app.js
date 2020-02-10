const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");


app.use(express.static('./view'))

// app.get('/',(req,res)=>{
//     res.send("success");
// });

app.get("/all", function (req, res) {
    fs.readdir("./view/static/", function (err, files) {
        const allFold = []
        if (err) {
            res.send({ data: null })
            return
        }
        files.forEach(function (file) {
            try {
                let stats = fs.statSync(`./view/static/${file}`)
                allFold.push({
                    isFold: stats.isDirectory(),
                    foldName: file,
                    type: path.extname(file),
                    dir:`/static/${file}`
                })
            } catch (err) {
                console.error(`ERROR: read file /view/static/${file} `)
            }
        });
        res.send({ data: allFold })
    });
})



app.listen("8081", () => {
    console.log(`server run in 8081`)
})