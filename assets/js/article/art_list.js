$(function () {
    var form = layui.form
    var laypage = layui.laypage;
    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }
    //定义一个查询参数对象
    var q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据，默认每页显示2条
        cate_id: '', // 文章分类的 Id
        state: '' // 文章的发布状态

    }

    initTable()
    initCate()
    //获取文章列表数据
    function initTable() {
        $.ajax({
            type: "GET",
            url: "/my/article/list",
            data: q,
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layui.layer.msg('获取失败')
                }
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                //渲染分页
                renderPage(res.total)
            }
        });
    }

    //初始文章分类的方法
    function initCate() {
        $.ajax({
            type: "GET",
            url: "/my/article/cates",
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg('获取失败')
                }
                console.log(res);
                var htmlStr = template('tpl-cate', res)
                // console.log(htmlStr);
                $('[name=cate_id]').html(htmlStr)
                form.render()
            }
        });
    }

    // 筛选表单绑定事件
    $('#form-search').on('submit', function (e) {
        e.preventDefault()
        // console.log('ok');
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        q.cate_id = cate_id
        q.state = state
        initTable()
    })

    //定义渲染分页的函数
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox', // 分页容器的 Id
            count: total, // 总数据条数
            limit: q.pagesize, // 每页显示几条数据
            curr: q.pagenum, // 设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            jump: function (obj, first) {
                console.log(obj.curr)
                // 把最新的页码值，赋值到 q 这个查询参数对象中
                q.pagenum = obj.curr
                q.pagesize = obj.limit
                if (!first) {
                    initTable()
                }
            }
        })
    }

    // 删除文章功能
    $('tbody').on('click', '.btn-delete', function () {
        //获取id
        var id = $(this).attr('data-id')
        console.log(id);
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                type: "GET",
                url: "/my/article/delete/" + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layui.layer.msg('删除失败')
                    }
                    layui.layer.msg('删除文章成功')
                    initTable()
                }
            });

            layer.close(index);
        });
    })

})