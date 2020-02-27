
var pageSize = 10, page = 1;

var form_data = $("#formList").serializeArray();
var result = {};
form_data.forEach(ele => {
    if (ele.name == "type" && ele.value == "0") ele.value = "";
    if (ele.value) result[ele.name] = ele.value;
});


$.get("/query", { data: JSON.stringify(result), pageSize: pageSize, page: page }, function (data) {
    if (data.code != 1) {
        $("#noData").show()
        $("#pagination").hide()
    } else {
        $("#noData").hide()
        $("#pagination").show()
        showTable(data.data)
    }
})

function showTable(data) {
    var str = "";
    for (let i = 0; i < data.length; i++) {
        str += '<tr>' +
            '<th scope="row">' + '</th>' +
            '<td>' + data[i].title + '</td>' +
            '<td>' + data[i].author + '</td>' +
            '<td>' + data[i].dynasty + '</td>' +
            '<td>' + data[i].content + '</td>' +
            '<td>' + data[i].type + '</td>' +
            '<td>' +
            '<button class="btn btn-default">编辑</button>' +
            '<button class="btn btn-default">删除</button>' +
            '</td>' +
            '</tr>'
        $("#tableList").html(str)
    }
}

function addPoetry() {
    var form_data = $("#mondalForm").serializeArray();
    var result = {};
    form_data.forEach(ele => {
        if (ele.name == "type" && ele.value == "0") ele.value = "";
        if (ele.value) result[ele.name] = ele.value;
    });
    if ($.isEmptyObject(result) == true) {
        alert("没有输入信息，不能提交哦~")
    } else {
        $.get("/addPoetry", { data: JSON.stringify(result) }, function (data) {
            
        })
    }
}