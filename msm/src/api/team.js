import  request  from "@/utils/request";

export default{
    // getList(){
    //     return request({
    //         url:'/team/list',
    //         method:'get'
    //     })
    // },
    search(page,size,searchMap){
        return request({
            url:'/team/list',
            method:'post',
            data:{
                page, 
                size,
                searchMap
            }
        })
    },
    add(team){
        return request({
            url:'/team',
            method:'post',
            data:team
        })
    },
    getById(id){
        return request({
            url:`/team?id=${id}`,
            method:'get'
        })
    },
    update(team){
        return request({
            url:'/team',
            method:'put',
            data:team
        })
    },
    deleteById(id){
        return request({
            url:'/team',
            method:'delete',
            data:{
                id
            }
        })
    }
}