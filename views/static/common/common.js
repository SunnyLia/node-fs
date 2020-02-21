const moment = require("moment");
const fs = require("fs");
const path = require("path");

exports.readdir = function (req, res) {
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
                type: path.extname(file).substr(1).toUpperCase(),
                dir: path1 + file,
                date: dateFormat(stats.atime),
                size: (stats.size / 1024).toFixed(2)
            })
        })
        // res.send({ data: allFold })
        res.render("index", { foldLists: allFold, breadcrumbs: path1.split("/") })
    })
}
exports.deldir = function (req, res) {
    //文件夹 ==> /images/GIF表情 - 副本/
    //文件 ==> /static/images/404 - 副本.jpg

    let path = unescape(req.query.path);
    if (path.indexOf("/static") == -1) {
        path = "/static" + path
    }
    delfile("./views" + path, res)
}
const delfile = function (path) {
    // 先判断此文件是文件夹还是文件
    var stat = fs.statSync(path);
    if (stat.isDirectory()) { // 是文件夹
        // 先获取到文件夹里所有的文件
        var files = fs.readdirSync(path)
        // 遍历文件再递归删除
        files.forEach(function (file) {
            delfile(path + file)
        })
        fs.rmdirSync(path);
    } else {//是文件
        // 直接删除该文件
        fs.unlinkSync(path)
    }
}
const dateFormat = function (date) {
    return moment(date).format('YYYY/MM/DD hh:mm');
}
