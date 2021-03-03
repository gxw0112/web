$(function () {
    $('#link_reg').on('click', function () {

        //点击去注册的链接
        $('.login-box').hide()
        $('.reg-box').show()
    })

    //点击去登录的链接
    $('#link_login').on('click', function () {
        $('.login-box').show()
        $('.reg-box').hide()
    })

    var form = layui.form
    //定义校验规则
    form.verify({
        //定义一个pwd密码的校验
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        //校验两个密码是否一样
        repwd: function (value) {
            var pwd = $('.reg-box [name=password]').val()
            if (pwd !== value) {
                return '两次密码不一样'
            }
        }
    })

    //监听注册表单的提交事件
    $('#form_reg').on('submit', function (e) {
        //阻止默认的提交行为
        e.preventDefault()
        var data = {
            username: $('#form_reg [name=username]').val(),
            password: $('#form_reg [name=password]').val()
        }
        // http://api-breakingnews-web.itheima.net/
        $.post('/api/reguser', data, function (res) {
            if (res.status !== 0) {
                return layer.msg(res.message)
            }
            layer.msg('注册成功，请登录!')
            $('#link_login').click()
        })

    })

    //登录
    $('#form_login').submit(function (e) {
        console.log('111');
        e.preventDefault()
        $.ajax({
            type: "POST",
            url: "/api/login",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg('登录失败')
                }

                layui.layer.msg('登录成功')
                console.log(res);
                //将得到的token 字符串，保存到localStorage中
                localStorage.setItem('token', res.token)
                location.href='/index.html'
            }
        });
    })
})