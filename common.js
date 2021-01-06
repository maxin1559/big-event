// 新知识：提前
//   1.ajaxPrefilter可以在任何请求正式发出请求之前，拿到对应该请求ajax内部配置{}里面的数据
//   2.对应给每个请求内部的数据{} 进行配置！
//   3.配置啥呢？
//       3.1 把根路径配置在下面函数内部
//       3.2 只有/my开头路径 带请求头带token令牌；
//       3.3 只有/my开头路径 验证当前带token令牌是否过期；

$.ajaxPrefilter(function(obj) {
    //  3.1 把根路径配置在下面函数内部
    obj.url = "http://api-breakingnews-web.itheima.net" + obj.url;

    //  代码要严谨：就是 /my开头的请求，就是需要配置下面；
    //  需求：怎么判断 obj.url 里面有 /my  
    //       证明路径上有 /my 字符串  
    //       登录 注册 不用做下面配置了！
    if (obj.url.indexOf("/my") != -1) {

        //  3.2 带请求头带token令牌；
        obj.headers = {
            Authorization: localStorage.getItem("token")
        };

        //  3.3 只有/my开头路径 验证当前带token令牌是
        obj.complete = function(xhr) {
            var obj = JSON.parse(xhr.responseText);
            if (obj.status == 1 && obj.message == '身份认证失败！') {
                localStorage.removeItem("token");
                location.href = "/login.html";
            }
        }
    }

});