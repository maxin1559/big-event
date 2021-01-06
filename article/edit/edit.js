// console.log();
// 

// 需求：http://127.0.0.1:5500/article/edit/edit.html?id=601&name=zs  {id:601,name:"zs"};
// 解决：
// ----------------------------------------1.为了获取地址上传入id值
function getID() {
    var url = location.href;
    var arr = url.split("?"); // JS基础：字符串与数组的相互转换
    url = arr[1];
    var params = url.split("&");
    var obj = {};
    for (var i = 0; i < params.length; i++) {
        var one = params[i]; //  id=601
        one = one.split("="); // ["id",601]
        var key = one[0]; // "id"
        var val = one[1]; // 601
        obj[key] = val;
    }
    return obj.id;
}
var id = getID();

// ----------------------------------------2.页面 下拉、富文本、cropper裁剪初始化加载
// 复制：从哪复制？
// -----------------分类数据
var form = layui.form;
var layer = layui.layer;
$.ajax({
    url: "/my/article/cates",
    success: function(res) {

        if (res.status == 0) {
            // 初始化默认空选项
            var str = `<option value="">空</option>`;
            // 遍历数据：累加
            $.each(res.data, function(index, item) {
                str += `<option value="${item.Id}">${item.name}</option>`;
            });
            // 设置HTML结构
            $("select").html(str);

            // 现在：基于layui.form 
            // 特性：更新渲染；layui语法规定  了解；
            form.render('select');
        }
    }
});


// ----------------富文本
initEditor();


// ----------------图片裁剪
$('#image').cropper({
    // 宽高比例
    aspectRatio: 400 / 280,
    // 预览区容器的类名
    preview: '.img-preview'
});
$(".selecBtn").click(function() {
    $("#file").click();
});
$('#file').change(function() {
    // 3.1 先找到文件对象
    var fileObj = this.files[0];

    // 3.2 JS语法内置URL构造函数：为选择的图片生成一个临时的url
    var url = URL.createObjectURL(fileObj);

    // 3.3 使用cropper插件配置方法，替换地图地址！
    $('#image').cropper("replace", url);
});


// --------------------------------------3.数据回填：
// 接口：要传递id给后台, 返回对应文章所有的信息！
$.ajax({
    url: "/my/article/" + id,
    success: function(res) {
        if (res.status == 0) {
            // form模块赋值    
            form.val("edit", res.data);

            // 图片被cropper初始化
            $('#image').cropper("replace", 'http://api-breakingnews-web.itheima.net' + res.data.cover_img);
        }
    }
});



// --------------------------------------4.确认修改：带id提交表单 
// 编辑带id：提交数据！
// 发布：提交数据和这类似！

$("form").on("submit", function(e) {
    e.preventDefault();

    // 快速收集数据
    var fd = new FormData(this);

    // 收集:id
    fd.append("Id", id);

    // 收集:富文本
    var val = tinyMCE.activeEditor.getContent();
    fd.append("content", val);


    // 收集:图片对象
    let canvas = $('#image').cropper('getCroppedCanvas', {
        width: 400,
        height: 280
    });
    canvas.toBlob(function(imgObj) {
        fd.append("cover_img", imgObj);


        // 提交数据
        $.ajax({
            url: "/my/article/edit",
            type: "POST",
            data: fd,
            processData: false,
            contentType: false,
            success: function(res) {
                layer.msg(res.message);
                if (res.status == 0) {
                    // 业务需求：回到list，里面代码就会被重新执行一次！重新加载！     
                    location.href = "/article/list/list.html";

                }
            }
        })
    });




})