//创建 axios实例并设置拦截器
import axios from 'axios'
import Taro from '@tarojs/taro';
let request = axios.create({
  // baseURL: "http://localhost:3005/api",
  baseURL: window.$baseURL,
  timeout: 5000
})
//请求拦截器
request.interceptors.request.use(config => {
  config.headers['Content-Type'] = 'application/json;chartset=utf-8'
  return config
})
//响应拦截器
request.interceptors.response.use(
  response => {
    let res = response.data
    if (response.status == 200) {
      if (res.code == 1000) {
        Taro.showToast({
          title: res.msg,
          icon: 'error',
          duration: 2000
        });
      }
      return res
    } else {
      return Promise.rejuect('error')
    }
  },
  error => {
    //异常code处理
    if (!error.response) {
      Taro.showToast({
        title: "服务器异常",
        icon: 'error',
        duration: 2000
      });
      return Promise.reject(error);
    }
    switch (error.response.status) {
      case 400:
        error.message = "请求错误！";
        break;
      case 401:
        error.message = "登录超时！";
        logout();
        break;
      case 402:
        error.message = "认证失败！";
        logout();
        break;
      case 403:
        error.message = "拒绝访问！";
        logout();
        break;
      case 404:
        error.message = "请求地址出错！";
        break;
      case 408:
        error.message = "请求超时！";
        break;
      case 413:
        error.message = "系统限制！";
        break;
      case 500:
        error.message = "服务器内部错误！";
        break;
      case 501:
        error.message = "服务未实现！";
        break;
      case 502:
        error.message = "网关错误！";
        break;
      case 503:
        error.message = "服务不可用！";
        break;
      case 504:
        error.message = "网关超时！";
        break;
      case 505:
        error.message = "HTTP版本不受支持！";
        break;
      default:
    }
    Taro.showToast({
      title: error.message,
      icon: 'error',
      duration: 2000
    });
    return Promise.reject(error);
  }
)
export default request