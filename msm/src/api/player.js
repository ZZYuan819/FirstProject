import request from '@/utils/request'

export default {
    search(page,size,searchMap){
        return request({
            url:'/player/list',
            method:'post',
            data:{
                page,
                size,
                searchMap
            }
        })
    },
    add(teamPojo){
        return request({
            url:'/player',
            method:'post',
            data:teamPojo
        })
    },
    getById(id){
        return request({
            url:`/player?id=${id}`,
            method:'get'
        })
    },
    update(teamPojo){
        return request({
            url:'/player',
            method:'put',
            data:teamPojo
        })
    },
    deleteById(id){
        return request({
            url:'/player',
            method:'delete',
            data:{id}
        })
    }
}