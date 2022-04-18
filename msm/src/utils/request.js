import axios from 'axios';
import { Loading, Message } from 'element-ui';

const loading = {
    loadingInstance: null,
    open: function () {
        if (this.loadingInstance === null) {
            this.loadingInstance = Loading.service({
                text: '拼命加载中',
                background: 'rgba(0,0,0,0.5)',
                target: '.main'
            })
        }
    },
    close: function () {
        if (this.loadingInstance !== null) {
            this.loadingInstance.close();
        }
        this.loadingInstance = null;
    }
}

const request = axios.create({
    // baseURL:'/',
    baseURL: process.env.VUE_APP_BASE_API,
    timeout: 5000
})

//请求拦截器
request.interceptors.request.use(config => {
    //请求拦截
    loading.open();
    return config
}, error => {
    //出现异常 ，抛出错误对象
    loading.close();
    return Promise.reject(error);
})
//响应拦截器
request.interceptors.response.use(response => {
    //请求拦截
    loading.close();
    if (response.data.code !== 2000) {
        Message({
            message:response.data.message || '系统异常',
            type:'warning',
            duration:5000
        })
    }
    return response
}, error => {
    //出现异常 ，抛出错误对象
    loading.close();
    Message({
        message:response.data.message,
        type:'error',
        duration:5000
    })
    return Promise.reject(error);
})

export default request