// 这个文件专门处理用户相关的
const express = require('express');
const bcryptjs = require('bcryptjs');//用户密码验证

const router = express.Router();

// 引入数据相关的model文件
const UserModel = require('../models/user');

//注册
router.post('/api/users', async (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    password = await bcryptjs.hash(password, 12);
    const user = new UserModel({
        username,
        password,
    })
    await user.save()
    res.send({
        code: 0,
        msg: 'ok',
    })
});

// 登录

router.post('/api/login', async (req, res) => {
    let username = req.body.username
    let password = req.body.password;

    //先个人你就用户名去查找用户
    // const user = await UserModel.findOne({ username })
    const user = await UserModel.findOne({ username })


    let isOk = false

    if (user) {
        isOk = await bcryptjs.compare(password, user.password)
    }
    if (isOk) {
        res.send({
            code: 0,
            msg: 'ok',
            data: {
                userId: user._id,
                userId: user.username
            }
        })
    } else {
        res.send({
            code: -1,
            msg: '用户名或密码错误'
        })
    }
})


// 登录页面
router.get('/login', async (req, res) => {
    res.render('login');
});

//注册页面
router.get('register', async (req, res) => {
    res.render('register');
});


//注册处理
router.post('/registerAction', async (req, res) => {
    const user = new UserModel({
        username: req.body.username,
        password: await bcryptjs.hash(req.body.password, 12)
    })
    await user.save()
    res.redirect('/login');

})

//登录处理
router.post('/loginAction', async (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    let isOk = false
    const user = await UserModel.findOne({ username })
    if (user) {
        // isOk = await bcryptjs.compare(password, user.paasword)
        isOk = await bcryptjs.compare(password, user.password)
        
    }
    if (isOk) {
        //用户验证通过
        // 1.给session上添加一些用户信息
        req.session.userInfo = {
            userId: user._id,
            username: user.username
        }
        res.redirect('/posts');
    } else {
        res.send('用户名或密码不正确')
    }

})
module.exports = router;
