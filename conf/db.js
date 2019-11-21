//用来连接 mongodb 数据库的文件

// 1.引入mongoose
const mongoose = require('mongoose')
// const uri = 'mongodb://127.0.0.1:27017/数据库名字'
const uri = 'mongodb://127.0.0.1:27017/express';

// 3.通过mongoose.connect()去链接，方法返回一个promise对象
mongoose
    .connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true

    })
    .then(() => {
        //链接成功
    })
    .catch(error => {
        console.log('数据库链接失败')
        console.log(error)
    })
    // 4.将已经链接到mongodb模块给暴露出去在其他位置使用
    module.exports = mongoose