const express = require('express')
const app = express()

const path = require('path')
const session = require('express-session')



//引入拆分出去的路径模块
const postRouter = require('./routes/post')
const userRouter = require('./routes/user')


// const postRouter = require('./rotues/post')
// const userRouter = require('./rotues/user')

//使用ejs模板引擎，模板页面的存放路径，ejs不需要引包
app.set('view engine', 'ejs')
app.set('views', path.resolve(__dirname, './views'))//_dirname处理绝对路径，需要引入path包


//req.body中间件的设置
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

~
//静态资源托管的设置
app.use(express.static(path.resolve(__dirname, './public')))


// 、、设置session相关的中间件
app.use(
    session({
        resave: true,
        saveUninitialized: true,
        secret: 'dsfewreefrfd',//随便写点什么就可以

        cookie: {
            maxAge: 60 * 1000 * 2
        }
    })
)
app.use(postRouter);
app.use(userRouter);

app.listen(8080)
console.log('服务已启动')