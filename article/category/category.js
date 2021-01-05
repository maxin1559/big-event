// --------------------------------------------------列表展示
// 发出请求，拿到数据，渲染遍历
function getList() {
  $.ajax({
    url: "/my/article/cates",
    success: function(res) {
      if (res.status == 0) {
        var str = '';
        // 遍历数据
        $.each(res.data, function(index, one) {
          str += `<tr>
                  <td>${one.name}</td>
                  <td>${one.alias}</td>
                  <td>
                    <button myid="${one.Id}" data-name="${one.name}" data-alias="${one.alias}" type="button" class="layui-btn layui-btn-xs edit">编辑</button>

                    <button myid="${one.Id}" type="button" class="layui-btn layui-btn-xs layui-btn-danger delete">删除</button>
                  </td>
                </tr>`;
        });

        // 完成后：
        $("tbody").html(str);

      }
    }
  });
}
getList();


// --------------------------------------------------新增
var layer = layui.layer;
// 业务设计：
//    1.页面上没有输入框，只有一个按钮！
//    2.用户点击按钮，弹窗：有输入框；layer;  https://www.layui.com/doc/modules/layer.html
var add_str = `
  <form class="layui-form add-form" action="" style="margin: 30px; margin-left: 0px;" id="add_form">
    <div class="layui-form-item">
      <label class="layui-form-label">类别名称</label>
      <div class="layui-input-block">
        <input type="text" name="name" required lay-verify="required" placeholder="请输入标题" autocomplete="off" class="layui-input">
      </div>
    </div>
    <div class="layui-form-item">
      <label class="layui-form-label">类别别名</label>
      <div class="layui-input-block">
        <input type="text" name="alias" required lay-verify="required" placeholder="请输入标题" autocomplete="off" class="layui-input">
      </div>
    </div>
    <div class="layui-form-item">
      <div class="layui-input-block">
        <button class="layui-btn" lay-submit lay-filter="formDemo">确认添加</button>
        <button type="reset" class="layui-btn layui-btn-primary">重置</button>
      </div>
    </div>
  </form>`;




// 点击显示提交弹窗：
$(".add").on("click", function() {
  layer.open({
    type: 1, // 页面类型，弹窗里面有丰富HTML结构页面
    title: '添加类别', // 弹窗标题
    content: add_str, // content：直译就是内容：弹窗内部页面的HTML结构的字符串
    area: ['500px', '250px'], // 弹窗显示大小 area 面积的意思；
    success: function(dom, index) {
      // 1.理解为上面HTML字符串，是个字符串，不是DOM节点，啥时候变为真正DOM，弹窗成功
      // 2.success：和ajax  success 没有关系；监听弹窗成功弹出来的时候；
      // 3.给form表单注册事件。是个字符串，没有form DOM节点；
      // 4.继续在内部写提交数据：代码变的不好维护，把下面代码封装

      // index:当前弹窗标识；

      add_submit(index);

    }
  });

})

// 弹窗内确认提交数据：
function add_submit(bs) {
  $(".add-form").on("submit", function(e) {
    e.preventDefault();

    // 1.收集数据
    var data = $(this).serialize();

    // 2.提交数据
    $.ajax({
      url: "/my/article/addcates",
      type: "post",
      data: data,
      success: function(res) {
        layer.msg(res.message);
        if (res.status == 0) {
          // 新增的弹窗要关闭
          layer.close(bs);

          // 列表重新加载
          getList();
        }
      }
    })

  })
}