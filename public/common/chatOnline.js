layui.use(['form', 'layer'], function () {
    var form = layui.form
        , layer = layui.layer,
        curPage=""
    var socket = io();
    socket.on('connect', function () {
        console.log("socket connect");
    });
    socket.on('disconnect', () => {
        console.log("socket disconnect");
        // socket.open();
    });
    // input回车发送
    $("#chatWord").keypress(function (e) {
        if (e.which == 13) {
            $("#send-btn").click();
        }
    });
    // 监听消息返回
    socket.on('chatLists', function (data) {
        if (data.code == 0) {
            chatListRend(data.data)
        } else {
            layer.msg(data.msg.name)
        }
    });
    // 进入退出监测
    socket.on('inORout', function (data) {
        var str = '<div id="inORout"><span>' + data.msg + '</span></div>';
        $("#chatList").append(str);
        var title = $(layero).find(".layui-layer-title").text();
        $(layero).find(".layui-layer-title").text(title + " (" + data.count + ")")
    });
    // 渲染消息
    function chatListRend(data) {
        var str = "";
        for (var i = 0; i < data.length; i++) {
            var name = data[i].userName;
            str +=
                '<div class="chatItem' + (name == user ? " self" : "") + '" style="padding: 10px;" data-id="single003">' +
                '<div class="author">' + (name == user ? "我" : name.slice(0, 2)) + '</div>' +
                '<div class="time"><span style="font-weight:bold" class="name">' + (name == user ? "" : name) + ' </span>' +
                '<span>' + (data[i].userChatTime ? data[i].userChatTime : "") + '</span></div>' +
                '<div class="massage">' + data[i].userChat + '</div>' +
                '</div>'
        }
        $("#chatList").append(str);
    }
    // 聊天列表点击事件
    $("#chatLists").on("click", ".chatItem", function (e) {
        var user = window.sessionStorage.getItem("user")
        if (!user) {
            layer.prompt({ title: '请先创建聊天身份', formType: 3 }, function (pass, index) {
                window.sessionStorage.setItem("user", pass);
                layer.close(index)
            });
        } else {
            socket.emit('login', { user: user });

            var roomId = $(e.currentTarget).attr("data-id");
            var title = $(e.currentTarget).find(".chatTitle").text();
            layer.open({
                type: 1,
                title: title,
                area: ['375px', '667px'],
                content: $("#chatRoom"),
                success: function (layero, index) {
                    curPage = layero;
                    socket.emit('join', { id: roomId, user: title }, function (num) {
                        $(layero).find(".layui-layer-title").text(title + " (" + num + ")")
                    });
                },
                cancle: function () {
                    socket.emit('inORout', title);
                }

            });
        }
    })
    // 发送事件
    $("#send-btn").on("click", function () {
        var msg = $("#chatWord").val();
        if (msg.trim() != "") {
            var sendData = {
                msg: msg,
                userName: user,
                toWho: getQuery("roomName"),
                roomId: getQuery("roomId"),
                // userId: ($(".self").length > 0 ? $(".self").eq(0).attr("data-id") : null)
            }
            socket.emit('sendMsg', sendData);
            $("#chatWord").val("")
        }
    })
    function getQuery(name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
            return unescape(r[2]);
        }
        return null;
    }
})