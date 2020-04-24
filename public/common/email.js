layui.use(['form', 'element'], function () {
    var form = layui.form;
    var element = layui.element;
    form.on('checkbox(sendNow)', function (data) {
        if (data.elem.checked) {
            $("#sendInp").prop("disabled", true)
        } else {
            $("#sendInp").prop("disabled", false)
        }

    });
    form.on('switch(sendSwitch)', function (data) {
        if (data.elem.checked) {
            $("#sendCont").hide();
            $(".crawlCont").show();
        } else {
            $("#sendCont").show();
            $(".crawlCont").hide();
        }

    });
    // 查看
    form.on('submit(formList)', function (data) {
        console.log(data.field);
        
        var queryData = $('#formList').serializeArray().reduce(function (obj, item) {
            if (item.value) {
                obj[item.name] = item.value;
                return obj;
            }
            return obj;
        }, {});
        console.log(queryData);
        
        query(queryData)
        return false;
    });
    function query(datas) {
        $.get("/sendCont", datas, function (data) {
            if (data.code == 0) {
                tableIns.reload();
                layer.msg('发送成功 ！');
            } else {
                layer.msg('发送失败 ！');
            }
        })
    }
})