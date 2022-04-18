var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/zzypj1');//数据库

//定义规则对象
var Schema = mongoose.Schema;
var userSchema = new Schema({
    number:{
        type:String,
        require:true
    },
    name:{
        type:String,
        require:true
    },
    height:{
        type:String,
        require:true
    },
    weight:{
        type:String,
        require:true
    },
    birthday:{
        type:String,
        require:true
    },
    team:{
        type:String,
        require:true
    },
    division:{
        type:String,
        require:true
    },
    salary:{
        type:String,
        require:true
    },
})




module.exports = mongoose.model('Player', userSchema);//表

