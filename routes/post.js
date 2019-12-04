const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const upload = multer({ dest: './uploads' });

const PostModel = require('../models/post');
const UserModel = require('../models/user');

//文章列表页面
router.get('/', async (req, res) => {
    // 1.获取分页的参数
    let pageNum = parseInt(req.query.pageNum) || 1;
    let pageSize = parseInt(req.query.pageSize) || 5;

    //1.获取数据
    const _posts = await PostModel.find()
        .skip((pageNum - 1) * pageSize)
        .limit(pageSize)
        .sort({ _id: -1 });//使最新添加的文章显示在最前面

    let posts = [];
    _posts.forEach(async post => {
        let obj = JSON.parse(JSON.stringify(post));

        // 1.取出每篇文章的用户Id
        let userId = post.user;

        //2.根据这个用户id去获取相应的用户信息
        let user = await UserModel.findById(userId);
        obj.user = user;
        posts.push(obj);
    });

    // 获取总条数
    const count = await PostModel.find().countDocuments();

    // 根据总条数算出总页数
    const totalPages = Math.ceil(count / pageSize);

    console.log(posts);

    res.render("post/index", { posts, totalPages, pageNum });
});

//文章新增页面
router.get('/create', async (req, res) => {
    res.render('post/create');
});

// 文章新增处理
router.post('/store', upload.single('picture'), async (req, res) => {
    //1.将临时文件放到lublic目录下

    //1.1 使用fs.readFlieSync()读取文件
    const fileData = fs.readFileSync(
        path.resolve(__dirname, '../uploads/', req.file.filename)
    )

    // 1.2 构建一个路径，public 目录下的路径
    const filename = new Date().getTime() + "-" + req.file.originalname;
    const filePath = path.resolve(__dirname, "../public/", filename);

    //1.3写文件
    fs.writeFileSync(filePath, fileData);

    //2将上传的；=路径的设置到当前文章的picture属性上
    let body = {
        ...req.body,
        user: req.userInfo.userId,
        picture: `http://localhost:8080/${filename}`
    };

    const post = new PostModel(body);
    await post.save();

    // 3.回到文章列表页
    res.redirect('/posts');
});




//文章详情页
router.get('/:id', async (req, res) => {
    // 1.获取文章id
    let id = req.params.id;

    // 2.查询数据
    const post = await PostModel.findOne({ _id: id });
    console.log(post);
    res.render('post/show', { post });
});
module.exports = router;
