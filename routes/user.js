const express = require('express');
const bcryptjs = require('bcryptjs');
const router = express.Router();

const UserModel = require('../models/user');

//登录页面
router.get('/login', async (req, res) => {
    //获取url地址上的redirect 参数
    let redirect = req.query.redirect;
    res.render('login', { redirect });

})


//注册页面
router.get('/register', async (req, res) => {
    res.render('register');
});

//注册处理
router.post('/registerAction', async (req, res) => {
    const user = new UserModel({
        username: req.body.username,
        password: await bcryptjs.hash(req.body.password, 12)
    });

    await user.save();

    res.redirect('/login')

});

//登录处理
router.post('/loginAction', async (req, res) => {
    let redirect = req.body.redirect;

    let username = req.body.username;
    let password = req.body.password;

    let isOk = false;
    const user = await UserModel.findOne({ username });
    if (user) {
        isOk = await bcryptjs.compare(password, user.password);


    }
    if (isOk) {
        //用户验证通过
        // 1、给session上添加一些用户的信息
        req.session.userInfo = {
            userId:user._id,
            username: user.username
        };
        res.redirect(redirect);


    } else {
        res.send('用户名或密码不正确')
    }


})

module.exports = router;