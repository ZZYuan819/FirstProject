import router from './router'
import {getUserInfo} from './api/login.js'

router.beforeEach((to,from,next)=>{
    const token = localStorage.getItem('NBA-token');
    if(!token){
        if(to.path === '/login' || to.path === '/register'){
            next();
        }else{
            next({path:'/login'})
        }
    }else{
        if(to.path === '/login'){
            next();
        }else if(to.path === '/register'){
            next()
        }else{
            getUserInfo(token).then(res=>{
                const resp = res.data;
                if(resp.flag){
                    localStorage.setItem('NBA-user',JSON.stringify(resp.data))
                    next()
                }else{
                    next({path:'/login'})
                }
            })
        }
    }
})
