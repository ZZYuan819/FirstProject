import request from '@/utils/request.js'

export default {
    //校验原始密码是否正确
    checkPwd(userId,password){
        return request({
            url:'/user/pwd',
            method:'post',
            data:{
                userId,
                password
            }
        })
    },
    updatePwd(userId,password){
        return request({
            url:'/user/pwd',
            method:'put',
            data:{
                userId,
                password
            }
        })
    }
}