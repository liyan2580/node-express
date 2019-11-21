const express = require('express')
const app = express();

const PostModel = require('./models/post');

//req.body中间件的设置
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//新增文章
app.post('/api/posts', async (req, res) => {
    // 1.获取前端传过来的参数 req.body

    // 2.写入数据库
    const post = new PostModel(req.body)//需要设置中间件
    try {
        const data = await post.save()
        console.log(data)

        res.send({
            code: 0,
            msg: 'ok'
        })
    } catch (error) {
        console.log(error)
        res.send({
            code: -1,
            msg: '错了'
        })

    }
})

//查询文章
app.get('/api/posts', async (req, res) => {
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
        code:0,
        msg:'ok',
        data:{
            list:posts,
            count
        }
    })
})


app.listen(8080)
console.log('服务已启动')