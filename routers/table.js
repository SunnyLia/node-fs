var mongodb = require("mongodb");
var MongoClient = mongodb.MongoClient;
var url = "mongodb://localhost:27017/";
exports.poetry = function (req, res) {
    res.render("table")
}
exports.query = function (req, res) {
    var data = JSON.parse(req.query.data);
    var size = parseInt(req.query.limit);
    var skip = (req.query.page - 1) * size;

    MongoClient.connect(url, { useUnifiedTopology: true }, function (err, client) {
        if (err) res.send({ code: 1, msg: err });
        var db = client.db("user"); //获取到user数据库
        var col = db.collection("poetry"); //获取到student集合(表)

        col.find(data).count(function (err, result) {
            col.find(data).skip(skip).limit(size).toArray((err, docs) => {
                if (err) {
                    res.send({ code: 1, msg: err });
                } else {
                    res.send({ code: 0, data: docs, count: result })
                }
                client.close();
            });
        })
    });
}
exports.addPoetry = function (req, res) {
    var data = JSON.parse(req.query.data);
    MongoClient.connect(url, { useUnifiedTopology: true }, function (err, client) {
        if (err) res.send({ code: 1, msg: err });
        var db = client.db("user"); //获取到user数据库
        var col = db.collection("poetry"); //获取到student集合(表)
        col.insertOne(data, function (err, result) {
            if (err) {
                res.send({ code: 1, msg: err });
            } else {
                res.send({ code: 0 })
            }
            client.close();
        })
    });
}
exports.editPoetry = function (req, res) {
    var data = JSON.parse(req.query.data);
    var _id = req.query._id;
    MongoClient.connect(url, { useUnifiedTopology: true }, function (err, client) {
        if (err) res.send({ code: 1, msg: err });
        var db = client.db("user"); //获取到user数据库
        var col = db.collection("poetry"); //获取到student集合(表)
        col.updateOne({ _id: mongodb.ObjectId(_id) }, { $set: data }, function (err, result) {
            if (err) {
                res.send({ code: 1, msg: err });
            } else {
                res.send({ code: 0 })
            }
            client.close();
        })
    });
}
exports.delPoetry = function (req, res) {
    var _id = req.query._id;
    MongoClient.connect(url, { useUnifiedTopology: true }, function (err, client) {
        if (err) res.send({ code: 1, msg: err });
        var db = client.db("user"); //获取到user数据库
        var col = db.collection("poetry"); //获取到student集合(表)
        col.deleteOne({ _id: mongodb.ObjectId(_id) }, function (err, result) {
            if (err) {
                res.send({ code: 1, msg: err });
            } else {
                res.send({ code: 0 })
            }
            client.close();
        })
    });
}