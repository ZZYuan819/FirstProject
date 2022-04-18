var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/zzypj1');//数据库

//定义规则对象
var Schema = mongoose.Schema;
var userSchema = new Schema({
    ranking:{
        type:String,
        require:true
    },
    name:{
        type:String,
        require:true
    },
    division:{
        type:String,
        require:true
    },
    entrydate:{
        type:String,
        require:true
    },
    officialwebsite:{
        type:String,
        require:true
    },
})




module.exports = mongoose.model('Team', userSchema);//表

