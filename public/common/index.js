var path = "/", name = "", layer = "";
layui.use('layer', function () {
    layer = layui.layer;
});
var copyPath = localStorage.getItem("copyPath");
var clipPath = localStorage.getItem("clipPath");
if (copyPath || clipPath) {
    $("#paste").removeClass("active")
} else {
    $("#paste").addClass("active")
}
$("body").click(function () {
    $("#menu").hide();
    $("#bodyMenu").hide();
})
$("body").on("contextmenu", function (e) {
    $("#menu").hide()
    $("#bodyMenu").show().css({ top: e.clientY - 60, left: e.clientX });
    return false;
})
//鼠标右击
$("#foldList").on("contextmenu", "li", function (e) {
    path = $(e.currentTarget).attr("href"); //获取到当前路径
    // if (path.indexOf("/static") == -1) {
    //     path = "/static" + path
    // }
    name = $(e.currentTarget).attr("name"); //获取到文件名
    $(this).addClass("active").siblings().removeClass("active");
    $("#bodyMenu").hide();
    $("#menu").show().css({ top: e.clientY - 60, left: e.clientX });
    return false
})
//鼠标双击
$("#foldList").on("dblclick", "li", function (e) {
    window.location.href = $(e.currentTarget).attr("href")
})
$("#bodyMenu li").on("click", function (e) {
    e.stopPropagation();
    var tex = $(e.target).text();
    if (tex == "新建") {
        return false;
    } else if (tex == "上传") {
        layer.confirm('<p>文件将被上传至当前目录</p><input type="file" name="file" id="file">', { title: '上传' }, function (index) {
            upForAjax()
            layer.close(index);
        });
    } else if (tex == "粘贴") {
        if (copyPath) {
            pasteForAjax(function () {
                localStorage.removeItem("copyPath");
            });
        } else if (clipPath) {
            clipForAjax(function () {
                localStorage.removeItem("clipPath");
            });
        } else {
            return;
        }
    } else if (tex == "文件夹") {
        addFoleForAjax(1, function () { });
    } else if (tex == "文本文档") {
        addFoleForAjax(0, function () { });
    }
    $("#bodyMenu").hide();
})
//菜单选择
$("#menu li").on("click", function (e) {
    var tex = $(e.target).text();
    if (tex == "打开") {
        window.open(path)
    } else if (tex == "复制") {
        localStorage.setItem("copyPath", path);
        localStorage.removeItem("clipPath");
        window.location.reload()
    } else if (tex == "剪切") {
        localStorage.removeItem("copyPath");
        localStorage.setItem("clipPath", path)
        window.location.reload()
    } else if (tex == "删除") {
        layer.confirm('确定要删除此文件嘛？', { title: '删除' }, function (index) {
            delForAjax();
            layer.close(index);
        });
    } else if (tex == "重命名") {
        var actInput = $("#foldList .active").find("input");
        actInput.show().focus().prev().hide();
        actInput.blur(function () {
            var newPath = path.replace(name, actInput.val());
            renameForAjax(newPath)
        });
    }
    $("#menu").hide();
})
function renameForAjax(newPath) {
    $.get("/rename", { oldPath: escape(path), newPath: escape(newPath) }, function (data) {
        if (data.code != 1) {
            alert(data.code)
        }
        window.location.reload()
    })
}
function delForAjax() {
    $.get("/deldir", { path: escape(path), name: escape(name) }, function (data) {
        if (data.code != 1) {
            alert(data.code)
        }
        window.location.reload()
    })
}
function pasteForAjax(callback) {
    $.get("/paste", { copyPath: escape(copyPath), pasteDir: escape(decodeURI(location.pathname)) }, function (data) {
        if (data.code != 1) {
            alert(data.code)
        } else {
            callback()
        }
        window.location.reload()
    })
}
function clipForAjax(callback) {
    $.get("/clip", { clipPath: escape(clipPath), pasteDir: escape(decodeURI(location.pathname)) }, function (data) {
        if (data.code != 1) {
            alert(data.code)
        } else {
            callback()
        }
        window.location.reload()
    })
}
function addFoleForAjax(code) {
    $.get("/addFold", { code: code, pasteDir: escape(decodeURI(location.pathname)) }, function (data) {
        if (data.code != 1) {
            alert(data.code);
        }
        window.location.reload()
    })
}
function upForAjax() {
    var files = $("#file")[0].files;
    var formData = new FormData();
    formData.append("file", files[0]);
    formData.append("pasteDir", escape(decodeURI(location.pathname)));

    $.ajax({
        type: 'POST',
        url: "/upload",
        data: formData,
        processData: false,   // jQuery不要去处理发送的数据
        contentType: false,   // jQuery不要去设置Content-Type请求头
        success: function (data) {
            if (data.code != 1) {
                alert(data.code)
            }
            window.location.reload()
        }
    });
}
