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
        res.render("index", { foldLists: allFold, breadcrumbs: path1.split("/"), title: callback })
    })
}

const dateFormat = function (date) {
    return moment(date).format('YYYY/MM/DD hh:mm');
}

const copyFile = function () {

}

const callback = function (tex, path) {
    console.log(tex, path);
    if (tex == '打开') {
    } else if (tex == '复制') {
    } else if (tex == '粘贴') {
    } else if (tex == '剪切') {
    } else if (tex == '删除') {
    } else if (tex == '重命名') {
    }
}