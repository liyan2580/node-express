// 这里专门处理和文章相关的路由

// 1.引入express
// const express = require('exrepss');???
const express = require('express')

// 2.创建一个router对象
const router = express.Router()

const PostModel = require('../models/post')
const auth = require('../middlewares/auth')


// 3.在router对象上处理路由的请求

//新增文章
router.post('/api/posts', async (req, res) => {
    // 1.获取前端传递过来的参数 req.body
    //2.写入数据库中
    const post = new PostModel(req.body)
    try {
        const data = await post.save()
        console.log(data)

        res.send({
            code: 0,
            mag: 'ok'
        })

    } catch (error) {
        console.log(error)
        res.send({
            code: -1,
            msg: '错了'
        })
    }
});


// 查询文章
//查询文章
router.get('/api/posts', async (req, res) => {
    // 1.取出前端传过来的参数
    let pageNum = parseInt(req.query.pageNum) || 1//请求第几页
    let pageSize = parseInt(req.query.pageSize) || 10//一页显示几条数据
    let title = req.query.title;

    // 2.获取文章列表
    const posts = await PostModel.find({ title: new RegExp(title) })
        .skip((pageNum - 1) * pageSize)
        .limit(pageSize)


    // 3.获取文章总条数
    const count = await PostModel.find({
        title: new RegExp(title)
    }).countDocuments()

    // 4.响应前端
    res.send({
        code: 0,
        msg: 'ok',
        data: {
            list: posts,
            count
        }
    })
})


//删除文章
router.delete('/api/posts/:id', async (req, res) => {
    // 1.取出需要删除文章的id名
    let id = req.params.id;

    // 2.删除
    await PostModel.deleteOne({ _id: id })//deleteOne传的是一个对象不能直接写(id)

    // 3.响应
    res.send({
        code: 0,
        msg: 'ok'
    })
})


//修改文章
router.put('/api/posts/:id/updata', async (req, res) => {
    // 1.取出需要删除的文章
    let id = req.params.id

    // 2.取出需要修改文章
    let title = req.body.title

    // await PostModel.updateOne({ _id: id }, { title: title })
    await PostModel.updateOne({ _id: id }, req.body)
    // 3.响应
    res.send({
        code: 0,
        msg: 'ok'
    })
})

//文章列表页面
router.get('/posts', auth, async (req, res) => {

    //获取分页的参数
    let pageNum = parseInt(req.query.pageNum) || 1
    let pageSize = parseInt(req.query.pageSize) || 5

    // 获取数据
    const posts = await PostModel.find()
        .skip((pageNum - 1) * pageSize)
        .limit(pageSize)
        .sort({ _id: -1 });//使新增加的文章排在最前面

    // 获取总条数
    const count = await PostModel.find().countDocuments()

    //根据总条数算出有多少页
    const totalPages = Math.ceil(count / pageSize)
    res.render('post/index', { posts, totalPages, pageNum })
})

//文章新增页面
router.get('posts/create', auth, async (req, res) => {
    res.render('post/create')
})

//文章现新增处理
router.post('/posts/store', auth, async (req, res) => {
    // 1.从前端传递过来的参数
    // 2。写入数据库
    const post = new PostModel(req.body)
    await post.save()

    // 3.回到文章列表页
    res.redirect('/posts')
})



//文章详情页面
router.get('/posts/:id', auth, async (req, res) => {
    // 1.获取文章id
    let id = req.params.id;
    // 2.查询数据
    const post = await PostModel.finOne({ _id: id });
    console.log(post)

    res.render('post/show', { post });
})

// 将这个router对象给传出去供其他地方使用
module.exports = router