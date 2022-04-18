var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/zzypj1');//数据库

//定义规则对象
var Schema = mongoose.Schema;
var userSchema = new Schema({
    username:{
        type:String,
        require:true
    },
    nickname:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    token:{
        type:String,
        require:true
    },
})




module.exports = mongoose.model('ZZY', userSchema);//表

