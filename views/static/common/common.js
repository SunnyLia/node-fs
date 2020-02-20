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

    const path = unescape(req.query.path);
    const name = unescape(req.query.name);
    console.log(path);
    
    // if(){ // 如果是文件夹
        // fs.rmdir("./views/static"+ path, function(err,file){
        //     if (err) {
        //         res.send({data:2})
        //         return 
        //     }
        //     res.send({data:1})
        // })
    // }else{//是文件
        fs.unlink("./views"+ path, function(err,file){
            if (err) {
                res.send({data:2})
                return 
            }
            res.send({data:1})
        })
    // }
}
const dateFormat = function (date) {
    return moment(date).format('YYYY/MM/DD hh:mm');
}
