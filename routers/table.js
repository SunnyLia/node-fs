var mongodb = require("mongodb");
var MongoClient = mongodb.MongoClient;
var url = "mongodb://localhost:27017/";
exports.poetry = function (req, res) {
    res.render("table")
}
exports.query = function (req, res) {
    var data = JSON.parse(req.query.data);
    var size = parseInt(req.query.pageSize);
    var skip = (req.query.page - 1)*size;
    
    MongoClient.connect(url, { useUnifiedTopology: true }, function (err, client) {
        if (err) res.send({code:0,msg:err});
        var db = client.db("user"); //获取到user数据库
        var col = db.collection("poetry"); //获取到student集合(表)
        col.find(data).skip(skip).limit(size).toArray((err, docs) => {
            console.log(docs);
            if(docs){
                res.send({data:docs,code:1})
            }else{
                res.send({data:[],code:0})
            }
        });
        client.close();
    });
}
exports.addPoetry = function (req, res) {}