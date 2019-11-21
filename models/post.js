// post表相关的model文件

// 1.引入之前已经连接到mongodb数据库的mongoose模块
const mongoose = require('../conf/db');

// 2.实例化一个 schema(描述表的结构的东西)
const schema = new mongoose.Schema({
    title:{
        type:String,
        require:true
    },
    body:{
        type:String,
        require:true
    }
})
// 3. 通过 mongoose.model() 生成当前 post 的model
//    第一个参数，是我们的表名的单数形式
const model = mongoose.model('post',schema)
// 4. 暴露出去
module.exports = model;