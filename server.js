const express = require('express');
const session = require('express-session');
const path = require('path');
const app = express();

//引入拆分出去的路由
const postRouter = require('./routes/post');
const auth = require('./middlewares/auth');
const userRouter = require('./routes/user'); 

//req.body中间件的设置
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//使用哪种模块引擎   模板页面的存放路径
app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "./views"));


//静态资源托管的设置
app.use(express.static(path.resolve(__dirname, './public')))

//设置session相关的中间件
app.use(
    session({
        resave: true,
        saveUninitialized: true,
        secret: 'fsfsadassdads',

        cookie: {
            maxAge: 60 * 1000 * 5
        }

    })
);
// app.use('/posts',postRouter)

app.use('/posts', auth, postRouter)
app.use(userRouter);
app.listen(8080)
console.log('服务已启动');