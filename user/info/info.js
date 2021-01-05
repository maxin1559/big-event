// ---------------------------------------------发出请求，获取用户数据，回填
// 需求：用户进入页面后，展示用户的基本信息！
var form = layui.form; // 引入功能！HTML页面已经引入layui.all.js 可以使用全部模块！


function getInfo() {
    $.ajax({
        url: '/my/userinfo',
        success: function(res) {
            // 数据：res.data   {username:"demo122"}
            // 回填：给表单赋值；

            // -----------------------------------------传统：
            // 找input，设置id, 拿到JQ对象，设置val值；
            // 不便于维护，设置多个id，项目很多话，写很多次赋值！

            // ------------------------------------------layui.form;
            // 快速赋值：步骤
            //    1.有特别类名表单 class="layui-form" 所在元素属性 lay-filter="" 对应的值
            //    2.input 输入框 name属性  和 对应data数据属性名要一致！
            form.val("info", res.data);

        }
    })
};
getInfo();

// ----------------------------------------------提交表单，修改数据
// 新知识：<input type="hidden" name="id" />  
//       作用：隐藏，页面看不见！  name="id"  存放id值 
//       为什么：要存放id ? 提交表单，接口要求有id值；快速取值！{昵称、邮箱、id值！}

$("form").on("submit", function(e) {
    e.preventDefault();

    // 1.收集数据 
    var data = form.val("info");


    // 2.提交数据
    $.ajax({
        type: "post",
        url: "/my/userinfo",
        data: data,
        success: function(res) {
            // 业务：不是代码强制！
            //     应该让index页面请求个人数据接口再次调用下！
            //     index页面显示name设计：nickname || username 联动！

            // 代码：在info.js里面 让 index.js 获取用户信息接口 重新执行！
            //       info 子页面
            //       index:父级页面
            //           window.parent 拿到 index.js 全局对象！
            //           需求 index.js 获取用户信息接口 在这重新执行！
            //           把  获取用户信息接口 封装为一个函数，
            //           全局函数就是window上方法！就可以在我们这info.js内部调用了！
            layer.msg(res.message);
            if (res.status == 0) {
                window.parent.getInfo();
            }
        }
    })

})




// ------------------------------------------------重置
// 业务：重置，看到啥？？回到原来的样子，没有提交数据之前的样子；上一次数据的样子
$(".reset").on("click", function(e) {
    // 1.阻止默认，全部清空数据；
    e.preventDefault();

    // 2.回到本来的样子：重新调用 用户信息获取 接口；
    getInfo();
});