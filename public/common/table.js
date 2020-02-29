
var pageSize = 10, page = 1;
layui.use(['form', 'layedit', 'laydate', 'table'], function () {
    var form = layui.form
        , layer = layui.layer
        , layedit = layui.layedit
        , laydate = layui.laydate
        , table = layui.table;
    table.render({
        elem: '#formList'
        , url: '/demo/table/user/' //数据接口
        , page: true //开启分页
        , toolbar: '#toolbarDemo'
        , defaultToolbar: []
        , cols: [[ //表头
            { field: 'id', title: '序号', width: 80, fixed: 'left' }
            , { field: 'author', title: '标题', width: 80 }
            , { field: 'title', title: '作者', width: 80 }
            , { field: 'dynasty', title: '朝代', width: 80 }
            , { field: 'content', title: '内容', width: 177 }
            , { field: 'type', title: '分类', width: 80 }
        ]]
        , page: true
    });
    //监听事件
    table.on('toolbar(formList)', function (obj) {
        var checkStatus = table.checkStatus(obj.config.id);
        switch (obj.event) {
            case 'add':
                // layer.confirm($('#modalDemo'), { title: '提示' }, function (index) {
                //     layer.close(index);
                // });
                layer.open({
                    type: 1,
                    title: "新增",
                    btn: ['确认', '取消'],
                    btnAlign: 'c',
                    content: $("#modalDemo"),
                    success: function (layero, index) { },
                    yes: function () {

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
// var form_data = $("#formList").serializeArray();
// var result = {};
// form_data.forEach(ele => {
//     if (ele.name == "type" && ele.value == "0") ele.value = "";
//     if (ele.value) result[ele.name] = ele.value;
// });


// $.get("/query", { data: JSON.stringify(result), pageSize: pageSize, page: page }, function (data) {
//     if (data.code != 1) {
//         $("#noData").show()
//         $("#pagination").hide()
//     } else {
//         $("#noData").hide()
//         $("#pagination").show()
//         showTable(data.data)
//     }
// })


// function addPoetry() {
//     var form_data = $("#mondalForm").serializeArray();
//     var result = {};
//     form_data.forEach(ele => {
//         if (ele.name == "type" && ele.value == "0") ele.value = "";
//         if (ele.value) result[ele.name] = ele.value;
//     });
//     if ($.isEmptyObject(result) == true) {
//         alert("没有输入信息，不能提交哦~")
//     } else {
//         $.get("/addPoetry", { data: JSON.stringify(result) }, function (data) {

//         })
//     }
// }