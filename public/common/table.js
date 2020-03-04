
// var pageSize = 10, page = 1;
layui.use(['form', 'layedit', 'layer', 'laydate', 'table'], function () {
    var form = layui.form
        , layer = layui.layer
        , layedit = layui.layedit
        , laydate = layui.laydate
        , table = layui.table;

    var tableIns = table.render({
        elem: '#tableList'
        , url: '/query'
        , page: true
        , even: true
        , toolbar: '#toolbarDemo'
        , where: { data: JSON.stringify({}) }
        , defaultToolbar: []
        , cols: [[
            { type: 'checkbox', fixed: 'left' }
            , { field: 'id', type: 'numbers', align: 'center', title: '序号', fixed: 'left' }
            , { field: 'author', align: 'center', title: '作者' }
            , { field: 'title', align: 'center', title: '标题' }
            , { field: 'dynasty', align: 'center', title: '朝代' }
            , { field: 'content', align: 'center', title: '内容' }
            , { field: 'type', align: 'center', title: '分类' ,templet: type_came}
        ]]
        , page: true
    });
    // 表单查询
    form.on('submit(formList)', function (data) {
        console.log(data.field);
        return false;
    });
    // 弹框提交
    form.on('submit(modalForm)', function (data) {
        var checkStatus = table.checkStatus("tableList").data[0];
        $.get("/addPoetry", { data: JSON.stringify(data.field), _id: checkStatus._id }, function (data) {
            if (data.code == 0) {
                layer.closeAll();
                tableIns.reload();
                layer.msg('更新成功 ！');
            } else {
                layer.msg('请稍后重试！');
            }
        })
        return false;
    });
    //监听按钮
    table.on('toolbar(tableList)', function (obj) {
        var checkStatus = table.checkStatus("tableList").data;
        switch (obj.event) {
            case 'add':
                layer.open({
                    type: 1,
                    title: "新增",
                    btnAlign: 'c',
                    content: $("#modalDemo"),
                    success: function (layero, index) {
                        console.log(layero);
                        
                        $("#modalForm")[0].reset();
                    }
                });
                break;
            case 'delete':
                if (checkStatus.length == 1) {
                    layer.confirm('确认要删除这条数据嘛?', { title: '提示' }, function (index) {
                        $.get("/delPoetry", { _id: checkStatus[0]._id }, function (data) {
                            if (data.code == 0) {
                                tableIns.reload();
                                layer.msg('删除成功 ！');
                            } else {
                                layer.msg('请稍后重试！');
                            }
                            layer.closeAll();
                        })
                    });
                } else {
                    layer.msg("请选择一行")
                }
                break;
            case 'update':
                if (checkStatus.length == 1) {
                    layer.open({
                        type: 1,
                        title: "编辑",
                        btnAlign: 'c',
                        content: $("#modalDemo"),
                        success: function (layero, index) {
                            form.val("modalForm", checkStatus[0]);
                        }
                    });
                } else {
                    layer.msg("请选择一行")
                }
                break;
        };
    });
    function type_came(v){
        if(v.type == 1){
            return "写事写人"
        }else if(v.type == 2){
            return "写景咏物"
        }else if(v.type == 3){
            return "言志抒情"
        }else{
            return "其他"
        }
    }
})
