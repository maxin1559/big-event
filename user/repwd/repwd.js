// ---------------------------------------------设计：
// 不能数据回填！以防让别人看到原来的密码！
// 等待用户提交新的数据
var form = layui.form;
var layer = layui.layer;


// - 1) 长度6~12位，非空字符 \S（两个新密码都要用）
// - 2) 新密码不能和旧密码相同
// - 3) 两次新密码必须一致

form.verify({
    changdu: [/^\S{6,12}$/, "输入密码不是6-12非空字符"],

    // 新密码和旧密码不一样：不能用数组，
    diff: function(val) {
        // val:形参 新密码的值  自定义规则放在谁上面，获取就是谁的值！
        // .oldPwd:旧密码的值 

        if (val == $(".oldPwd").val()) {
            return "新密码和旧密码不能一样！"
        }
    },

    // 两次新密码必须一致
    same: function(val) {
        // val:形参 确认密码的值
        // .newPwd :新密码

        if (val != $(".newPwd").val()) {
            return "两次新密输入的不一样！"
        }
    }
})












$("form").on("submit", function(e) {
    e.preventDefault();

    // 1.快速收集数据，（之前有个数据验证）
    // form.val();
    var data = $(this).serialize();

    // 2.提交数据
    $.ajax({
        url: "/my/updatepwd",
        type: "post",
        data: data,
        success: function(res) {

            if (res.status == 0) {
                // 弹窗里面的一个方法;简单弹窗;  ajax day-03
                layer.msg(res.message);

                // 表单重置：$("form")[0] 获取原生form表单；原生DOM上方法；重置；
                $("form")[0].reset();
            }
        }
    })

})