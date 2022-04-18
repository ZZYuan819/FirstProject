import request from '@/utils/request'

//登录
export function login(username,password){
    return request({
        method:'post',
        url:'/user/login',
        data:{
            username,
            password
        }
    })
}

//获取用户信息
export function getUserInfo(token){
    return request({
        method:'get',
        url:`/user/info?token=${token}`
    })
}

//退出登录
export function logout(token){
    return request({
        method:'post',
        url:'/user/logout', 
        data:{
            token
        }
    })
}