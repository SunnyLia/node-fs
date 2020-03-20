var mongodb = require("mongodb");
var MongoClient = mongodb.MongoClient;
var url = "mongodb://localhost:27017/";

exports.getChat = function (req, res) {
    res.render("chatOnline")
}
exports.chatRoom = function (req, res) {
    MongoClient.connect(url, { useUnifiedTopology: true }, function (err, client) {
        if (err) {
            console.log(err)
            res.render("chatRoom", { chatLists: [] })
        }
        var db = client.db("user");
        var col = db.collection("chatLists"); //获取到chatLists表
        col.find({ "roomId": req.query.roomId }).toArray((err, docs) => { //获取到所有的文档
            if (err) {
                res.render("chatRoom", { chatLists: [] })
            } else {
                res.render("chatRoom", { chatLists: docs })
            }
            client.close();
        })
    });

}