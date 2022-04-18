import request from '@/utils/request'

export function register(username,nickname,password){
    return request({
        method:'post',
        url:'/user/register',
        data:{
            username,
            nickname,
            password
        }
    })

}