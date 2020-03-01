
var pageSize = 10, page = 1, modal = 1;
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
        , toolbar: '#toolbarDemo'
        , where: { data: JSON.stringify({}) }
        , defaultToolbar: []
        , cols: [[
            { field: 'id', type: 'numbers', title: '序号', fixed: 'left' }
            , { field: 'author', title: '标题' }
            , { field: 'title', title: '作者' }
            , { field: 'dynasty', title: '朝代' }
            , { field: 'content', title: '内容' }
            , { field: 'type', title: '分类' }
        ]]
        , page: true
    });
    form.on('submit(formList)', function (data) {
        console.log(data.field);
        return false;
    });
    form.on('submit(modalForm)', function (data) {
        console.log(data.field);
        $.get("/addPoetry", { data: JSON.stringify(data.field) }, function (data) {
            if (data.code == 0) {
                layer.close(modal);
                layer.msg('更新成功 ！');
                tableIns.reload();
            } else {
                layer.msg('请稍后重试！');
            }
        })
        return false;
    });
    //监听事件
    table.on('toolbar(tableList)', function (obj) {
        var checkStatus = table.checkStatus(obj.config.id);
        console.log(checkStatus);

        switch (obj.event) {
            case 'add':
                layer.open({
                    type: 1,
                    title: "新增",
                    btnAlign: 'c',
                    content: $("#modalDemo"),
                    success: function (layero, index) {
                        modal = index;
                    }
                });
                break;
            case 'delete':
                layer.msg('删除');
                break;
            case 'update':
                layer.msg('编辑');
                break;
        };
    });
})
