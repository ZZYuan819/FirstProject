var express = require('express');
var router = express.Router();
var User = require('./user.js')
var Team = require('./team.js')
var Player = require('./player.js') 
var md5 = require('blueimp-md5');
const { response } = require('express');
const player = require('./player.js');

router.post('/user/register', function (req, res) {
    // console.log(req.body);
    // res.send(req.body)
    var body = req.body;
    User.find({
        $or: [{
            username: body.username
        }, {
            nickname: body.nickname
        }]
    }, function (err, data) {
        if (err) {
            return res.status(500).json({
                code: 3000,
                flag: false,
                message: 'server error'
            })
        } if (data.length !== 0) {
            return res.status(200).json({
                code: 4000,
                flag: false,
                message: '账号或昵称已存在'
            })
        }
        body.token = md5(md5(body.username) + 'zzy');
        new User(body).save(function (err, data) {
            if (err) {
                return res.status(500).json({
                    code: 3000,
                    flag: false,
                    message: 'server error 存储失败'
                })
            }
            return res.status(200).json({
                code: 2000,
                flag: true,
                message: '注册成功'
            })
        })
    })

})

router.post('/user/login', function (req, res) {
    var body = req.body;
    User.findOne({
        username: body.username,
        password: body.password
    }, function (err, data) {
        if (err) {
            return res.status(500).json({
                code: 3000,
                flag: false,
                message: 'server error'
            })
        } if (!data) {
            return res.status(200).json({
                code: 4000,
                flag: false,
                message: '账号或密码错误'
            })
        }
        return res.status(200).json({
            code: 2000,
            flag: true,
            message: '登陆成功',
            data: {
                token: data.token
            }
        })
    })
})

router.get('/user/info', function (req, res) {
    const body = req.query;
    User.findOne({
        token: body.token
    }, function (err, data) {
        if (err) {
            return res.status(500).json({
                code: 3000,
                flag: false,
                message: 'server error'
            })
        } if (!data) {
            return res.status(200).json({
                code: 4000,
                flag: false,
                message: '账号不存在或已过期'
            })
        }
        return res.status(200).json({
            code: 2000,
            flag: true,
            message: '获取用户信息成功',
            data: {
                nickname: data.nickname,
                username: data.username,
                id: data._id
            }
        })
    })
})

router.post('/user/logout', function (req, res) {
    const body = req.body;
    User.findOne({
        token: body.token
    }, function (err, data) {
        if (err) {
            return res.status(500).json({
                code: 3000,
                flag: false,
                message: 'server error'
            })
        }
        if (!data) {
            return res.status(200).json({
                code: 4000,
                flag: false,
                message: '登录信息(token)不存在或已过期'
            })
        }
        return res.status(200).json({
            code: 2000,
            flag: true,
            message: '退出成功'
        })
    })
})


//获取所有球队列表
router.get('/team/list', function (req, res) {
    Team.find({}, function (err, data) {
        if (err) {
            return res.status(500).json({
                code: 3000,
                flag: false,
                message: 'server error'
            })
        }
        return res.status(200).json({
            code: 2000,
            flag: true,
            message: '球队信息获取成功',
            data: {
                total: data.length,
                rows: data
            }
        })
    })
})

//获取球队信息（分页）
router.post('/team/list', function (req, res) {
    //前端传入
    let page = req.body.page || 1;
    let size = req.body.size || 10;
    let searchMap = req.body.searchMap || {};
    //后端真正查询条件
    let obj = {};
    searchMap.ranking ? obj["ranking"] = searchMap.ranking : obj;
    searchMap.name ? obj["name"] = searchMap.name : obj;
    searchMap.division ? obj["division"] = searchMap.division : obj;
    searchMap.entrydate ? obj["entrydate"] = searchMap.entrydate : obj;
    // console.log(req.body.page,req.body.size);
    Team.find(obj, function (err, data) {
        if (err) {
            return res.status(500).json({
                code: 3000,
                flag: false,
                message: 'server error'
            })
        }

        let count = data.length;
        Team.find(obj).skip((page - 1) * parseInt(size)).limit(parseInt(size)).exec(function (err, data) {
            if (err) {
                return res.status(500).json({
                    code: 3000,
                    flag: false,
                    message: 'server error'
                })
            }
            return res.status(200).json({
                code: 2000,
                flag: true,
                messgae: '查找成功',
                data: {
                    total: count,
                    rows: data
                }
            })
        })
    })

})

//新增球队信息
router.post('/team',function(req,res){
    var body = req.body;
    new Team(body).save(function(err){
        if(err){
            return res.status(500).json({
                code:3000,
                flag:false,
                message:'server error'
            })
        }
        return res.status(200).json({
            code:2000,
            flag:true,
            message:'新增球队成功'
        })
    })
})

//通过id查找一条球队信息
router.get('/team',function(req,res){
    Team.findById(req.query.id,function(err,data){
        if(err){
            return res.status(500).json({
                code:3000,
                flag:false,
                message:'根据ID查找一条球队信息失败'
            })
        }
        return res.status(200).json({
            code:2000,
            flag:true,
            message:'根据ID查找一条球队信息成功',
            data:data
        })
    })
})

//根据ID更新一条球队信息
router.put('/team',function(req,res){
    var id = req.body._id;
    Team.findByIdAndUpdate(id,req.body,function(err){
        if(err){
            return res.status(500).json({
            code:3000,
            flag:false,
            message:'server error'
        })
        }
        return res.status(200).json({
            code:2000,
            flag:true,
            message:'更新球队信息成功'
        })
    })
})

//根据ID删除一条球队信息
router.delete('/team',function(req,res){
    const id = req.body.id;
    Team.findByIdAndRemove(id,function(err){
        if(err){
            return res.status(500).json({
                code:3000,
                flag:false,
                message:'server error' 
            })
        }
        return res.status(200).json({
            code: 2000,
            flag: true,
            message: "删除教师成功"
        })
    })
})

//获取球员信息（分页）
router.post('/player/list',function(req,res){
    var page = req.body.page||1;
    var size = req.body.size||10;
    var searchMap = req.body.searchMap||{};
    let obj = {};
    searchMap.number ? obj["number"] = searchMap.number : obj;
    searchMap.name ? obj["name"] = searchMap.name : obj;
    searchMap.height ? obj["height"] = searchMap.height : obj;
    searchMap.weight ? obj["weight"] = searchMap.weight : obj;
    searchMap.birthday ? obj["birthday"] = searchMap.birthday: obj;
    searchMap.team ? obj["team"] = searchMap.team : obj;
    searchMap.division ? obj["division"] = searchMap.division : obj;
    searchMap.salary ? obj["salary"] = searchMap.salary : obj;
    Player.find(obj,function(err,data){
        if(err){
            return res.status(500).json({
                code:3000,
                flag:false,
                message:'server error'
            })
        }
        let count = data.length;
        Player.find(obj).skip((page-1)*parseInt(size)).limit(parseInt(size)).exec(function (err, data) {
            if (err) {
                return res.status(500).json({
                    code: 3000,
                    flag: false,
                    message: 'server error'
                })
            }
            return res.status(200).json({
                code: 2000,
                flag: true,
                messgae: '查找成功',
                data: {
                    total: count,
                    rows: data
                }
            })
        })

    })


})

//新增球员信息
router.post('/player',function(req,res){
    var body = req.body;
    // console.log(body);
    new Player(body).save(function(err){
        if(err){
            return res.status(500).json({
                code:3000,
                flag:false,
                message:'server error'
            })
        }else{
            return res.status(200).json({
                code:2000,
                flag:true,
                message:'新增成功'
            })
        }
    })
})

//根据ID查找学生信息
router.get('/player',function(req,res){
    Player.findById(req.query.id,function(err,data){
        if(err){
            return res.status(500).json({
                code:3000,
                flag:false,
                message:'server error'
            })
        }
        return res.status(200).json({
            code:2000,
            flag:true,
            message:'根据ID查找球员信息成功',
            data:data
        })
    })
})

//根据ID更新球员信息
router.put('/player',function(req,res){
    Player.findByIdAndUpdate(req.body._id,req.body,function(err){
        if(err){
            return res.status(500).json({
                code:3000,
                flag:false,
                message:'server error'
            })
        }
        return res.status(200).json({
            code:2000,
            flag:true,
            message:'更新球员信息成功'
        })
    })
})

//根据ID删除球员信息
router.delete('/player',function(req,res){
    Player.findByIdAndRemove(req.body.id,function(err){
        if(err){
            return res.status(500).json({
                code:3000,
                flag:false,
                message:'server error'
            })
        }
        return res.status(200).json({
            code:2000,
            flag:true,
            message:'以成功删除本条球员信息'
        })
    })
})

//校验密码是否正确
router.post('/user/pwd',function(req,res){
    var body = req.body;
    User.findOne({
        _id:body.userId,
        password:body.password
    },function(err,data){
        if(err){
            res.status(500).json({
                code:3000,
                flag:false,
                message:'server error'
            })
        }
        if(!data){
            return res.status(200).json({
                code:4000,
                flag:false,
                message:'原密码不正确'
            })
        }else{
            return res.status(200).json({
                code:2000,
                flag:true,
                message:'密码正确'
            })
        }
    })
})

//更新密码
router.put('/user/pwd',function(req,res){
    var id = req.body.userId;
    User.findOne({
        _id:id
    },function(err,data){
        if(err){
            return res.status(500).json({
                code:3000,
                flag:false,
                message:'server error'
            })
        }
        if(!data){
            return res.status(200).json({
                code:4000,
                flag:false,
                messgae:'密码错误'
            })
        }
        data.password = req.body.password;
        User.findByIdAndUpdate(id,data,function(err){
            if(err){
                return res.status(500).json({
                    code:3000,
                    flag:false,
                    message:'server error'
                })
            }
            return res.status(200).json({
                code:2000,
                flag:true,
                message:'修改密码成功'
            })
        })
    })
})


module.exports = router; 