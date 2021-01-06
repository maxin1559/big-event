// -------------------------------加载分类数据
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


// -------------------------------------富文本编辑器
// 方法：学校已经初始化封装好，
//      我们其实是可以直接把封装好内代码直接放在本JS内
//       很多配置：需要自己查文档
initEditor();



// -------------------------------------图片裁剪区 cropper
// 初始化插件
$('#image').cropper({
    // 宽高比例
    aspectRatio: 400 / 280,
    // 预览区容器的类名
    preview: '.img-preview'
});

// 本来样式很丑,用好看按钮去代替
$(".selecBtn").click(function() {
    $("#file").click();
});

// 给#file 注册change事件，当图片改变时，触发下面函数：
// 文件域的内容改变的时候，更换剪裁区的图片
$('#file').change(function() {
    // 3.1 先找到文件对象
    var fileObj = this.files[0];

    // 3.2 JS语法内置URL构造函数：为选择的图片生成一个临时的url
    var url = URL.createObjectURL(fileObj);

    // 3.3 使用cropper插件配置方法，替换地图地址！
    $('#image').cropper("replace", url);
});



// ----------------------------------------发布文章
// HTML：提交数据必须是 form表单！
// JS ：便于收集数据 代码简单了！
// 提交数据：提交什么数据格式，由后台决定！
//      url编码格式
//      formData格式：用于提交大量数据或者文件！
$("form").on("submit", function(e) {
    e.preventDefault();

    // 1.收集数据:特别对象的形式,使用方法查看上面保存的数据;
    //            formData 必须input等有name属性值：参数名
    var fd = new FormData(this);
    // fd.forEach(function(val, key) {
    //   console.log(val, key);
    // });


    // 2.发现:content内容没有收集到！
    //        其实本来是可以收集到的！<textarea name="content">
    //        插件的问题，textarea已经被富文本编辑器插件初始化了，不是原来textarea
    //   解决：需要把内容手动添加
    //         内容：插件的方法找到内容！ tinyMCE.activeEditor.getContent(); 【收集】
    //         手动添加:fd.append("content",内容)
    var val = tinyMCE.activeEditor.getContent();
    fd.append("content", val);


    // 3.图片：需要收集对象；
    //        被cropper初始化了，图片直接获取对象不行！
    //        肯定是cropper插件的方法，帮助我们获取裁剪后图片的对象！
    let canvas = $('#image').cropper('getCroppedCanvas', {
        width: 400,
        height: 280
    });
    canvas.toBlob(function(imgObj) {
        // 参数：帮助我们获取裁剪后图片的对象！
        fd.append("cover_img", imgObj);


        // 4.提交数据
        $.ajax({
            url: "/my/article/add",
            type: "POST",
            data: fd,
            // 固定的：JQ ajax提交formData数据，语法要求！ajax day03最后一个视频
            processData: false, // 默认进行url编码，不用了！
            contentType: false, // 默认url编码，不用了！
            success: function(res) {
                layer.msg(res.message);
                if (res.status == 0) {
                    // 业务需求：发布后，转跳文章列表；简单创建list  HTML页面；
                    location.href = "/article/list/list.html";

                    // 问题：需要修改index页面的对应文章列表的 选中状态 样式！
                    var dd = window.parent.document.querySelector("#articleList");
                    $(dd).addClass("layui-this");
                    $(dd).next().removeClass("layui-this"); // 下一个兄弟元素



                    // 想法：是否可以弄成触发点击文章列表，可以试下；上面转跳就不用写！
                }
            }
        })
    });




})