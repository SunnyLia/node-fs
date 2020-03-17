layui.use(['form', 'layer'], function () {
    var form = layui.form
        , layer = layui.layer

    $("#chatLists").on("click", ".chatItem", function (e) {
        var user = window.sessionStorage.getItem("user")
        if (!user) {
            layer.prompt({ title: '请先输入聊天身份', formType: 3 }, function (pass, index) {
                window.sessionStorage.setItem("user", pass)
                layer.close(index)
            });
        } else {
            layer.open({
                type: 2,
                title:"我的中国心",
                area: ['375px', '667px'],
                content: ['/chatRoom'],
                success: function () { //此处用于演示
                    console.log(11111111);
                    
                }
            });
        }
    })
})