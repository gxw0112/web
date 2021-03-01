$(function () {
    //调用这个函数getUserInfo获取基本信息
    getUserInfo()

    //实现退出功能
    var layer = layui.layer
    $('#btnLogout').on('click', function () {
        layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function (index) {
            //do something
            //清空token
            localStorage.removeItem('token')
            location.href = '/login.html'
            layer.close(index);
        });
    })
})
//获取用户基本信息
function getUserInfo() {
    $.ajax({
        type: "GET",
        url: "/my/userinfo",
        data: "data",
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function (res) {
            console.log(res);
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败')
            }
            renderAvatar(res.data)
        },
        // complete: function (res) {
        //     // console.log(res);
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！'){
        //         localStorage.removeItem('token')
        //         location.href='/login.html'
        //     }
        // }
    });
}

//渲染用户的头像
function renderAvatar(user) {
    //1获取用户名称
    var name = user.nickname || user.username
    //2设置文本
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
    //3按需阮然头像
    if (user.user_pic !== null) {
        //3.1渲染去骗头像
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide()
    } else {
        //3.2渲染文本头像
        $('.layui-nav-img').hide()
        var first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()
    }
}