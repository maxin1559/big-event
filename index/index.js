// ----------------------------------------------
// 如果有人是通过修改地址栏过来，判断本地是否有token;
// 有：token 正常登录状态
// 无：贼
if (localStorage.getItem("token") == null) {
    location.href = "../login.html";
}




// 场景：防用户长时间不操作
//    你去朋友家，用他电脑登录公司主页，
//    刚登录进，他喊你吃法，你把电脑放那，下午回来再看
//    出去吃法，很长！遇见几个朋友，KTV喝酒唱歌！忘了页面没关！
// 朋友：
//    页面开着呢，是公司页面哎，点点；
//    接口会请求,很长时间！token发生服务器，过期token值
//    返回专门对象,前端处理：需要页面token清除掉 回到登录页！

// 代码：按照道理在每个ajax方法里面都要加下面这个代码，觉得麻烦就对了！！！
//       下次课解决简单化处理问题！

// --------------------------------------------------获取用户信息
// 查接口文档
$.ajax({
    url: "http://ajax.frontend.itheima.net/my/userinfo",
    // type:"get",  默认就是get

    // 语法设置请求头 ：带上token值；
    headers: {
        Authorization: localStorage.getItem("token")
    },
    success: function(res) {
        // 成功的时候
        if (res.status == 0) {
            // 名字：如果有昵称就显示昵称，若没有显示用户名；
            var name = res.data.nickname || res.data.username;
            $(".username").html(name);

            // 头像：如果有头像地址显示图片，显示头像！ 
            if (res.data.user_pic) {
                $(".layui-nav-img").show().attr("src", res.data.user_pic);
                $(".avatar").hide();
            }
            //       如果没有，截取名字第一个字符，大写！显示在avatar盒子内
            else {
                // 截取名字第一个字符
                var first = name.substr(0, 1);
                // 大写：中文没有，有肯能是英文开头；
                first = first.toUpperCase();

                $(".layui-nav-img").hide();
                $(".avatar").show().html(first).css("display", "inline-block");
            }
        }



    },


    //   ******长时间不操作在刷新就会 token就会过期 就返回登录页   只要长时间不动，**************************


    // 发出请求，接受后台返回数据，无论成功失败！
    complete: function(xhr) {
        // xhr: 原生xhr对象可以使用
        // xhr.responseJSON  对象  ====>   JSON.parse(xhr.responseText)
        // xhr.responseText  JSON格式字符串
        var obj = JSON.parse(xhr.responseText);

        // 返回字段就是这个样子呢？后台返回的！不是前端定！
        if (obj.status == 1) {
            localStorage.removeItem("token");
            location.href = "../login.html";
        }
    }




})




// ---------------------------------------------------退出
var layer = layui.layer;
$("#logout").on("click", function() {
    // confirm：询问
    //          带了两个按钮，确定，取消
    //          参数1：询问的话
    //          参数2：点击确认的时候，执行的函数
    layer.confirm("死鬼，你要离开我了?", function(index) {
        // index: 数值用于关闭当前弹窗！

        // 产品设计：就是需求！回到登录页！token还在本地存着！
        localStorage.removeItem("token");
        location.href = "../login.html";
        layer.close(index); // 加不加都行！
    });


});