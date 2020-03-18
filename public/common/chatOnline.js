layui.use(['form', 'layer'], function () {
    var form = layui.form
        , layer = layui.layer

    $("#chatLists").on("click", ".chatItem", function (e) {
        var user = window.sessionStorage.getItem("user")
        if (!user) {
            layer.prompt({ title: '请先创建聊天身份', formType: 3 }, function (pass, index) {
                window.sessionStorage.setItem("user", pass)
                layer.close(index)
            });
        } else {
            var roomId = $(e.currentTarget).attr("data-id");            
            layer.open({
                type: 2,
                title: false,
                closeBtn: 0,
                area: ['375px', '667px'],
                content: ['/chatRoom.htm?roomId='+roomId]
            });
        }
    })
})