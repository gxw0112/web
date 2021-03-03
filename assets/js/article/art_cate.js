$(function () {
    var layer = layui.layer
    var form = layui.form
    initArtCateList()
    //获取文章分类的类表
    function initArtCateList() {;
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }

    //添加按钮
    var indexAdd = null
    $('#btnAddCate').on('click', function () {
        console.log('11');
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        })
    })

    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault()
        console.log('ok');
        $.ajax({
            type: "POST",
            url: "/my/article/addcates",
            data: $(this).serialize(),
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layui.layer.msg('新增分类失败')
                }
                initArtCateList()
                layui.layer.msg('新增分类成功')
                layer.close(indexAdd)
            }
        });
    })

    //通过代理为编辑绑定事件
    var indexEdit = null
    $('tbody').on('click', '.btn-edit', function () {
        // console.log('ok');
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        })
        var id = $(this).attr('data-id')
        // console.log(id);
        //发起请求获取相应 分类的数据
        $.ajax({
            type: "GET",
            url: "/my/article/cates/" + id,
            success: function (res) {
                form.val('form-edit', res.data)
                // console.log(res);
            }
        });
    })


    //通过代理形似修改表单事件
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新分类数据失败！')
                }
                layer.msg('更新分类数据成功！')
                layer.close(indexEdit)
                initArtCateList()
            }
        })
    })
    //通过代理删除事件
    $('tbody').on('click', '.btn-delete', function () {
        var id = $(this).attr('data-id')
        // console.log(id);
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败！')
                    }
                    layer.msg('删除分类成功！')
                    layer.close(index)
                    initArtCateList()
                }
            })
        })
    })
})