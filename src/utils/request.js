// 封装axios，定义拦截器
import axios from "axios";

const request = axios.create({
  baseURL: "/",
  // headers: {},
  // timeout: 10000
});

// 先触发请求拦截器 - 发送请求 - 响应拦截器 - 触发then/catch/await
// 请求拦截器（设置公共的请求参数、请求头）
request.interceptors.request.use(
  (config) => {
    // config是请求的所有信息
    // if (token) {
    // config.headers['authorization'] = `Bearer ${token}`;
    // config.headers['token'] = token;
    // }
    return config;
  }
  // () => {}
);

// 响应拦截器（1. 判断响应具体是成功还是失败 2. 返回更加具体的错误提示）
request.interceptors.response.use(
  // 看响应状态码决定响应成功、失败
  // 响应成功 2xx 200-299
  (response) => {
    // 请求成功 、响应成功并不代表功能成功
    // 功能是否成功，看响应结果的code
    // code是20000才是功能成功，非20000就是功能失败
    // response.data代表响应数据
    if (response.data.code === 20000) {
      // 功能成功 -- 返回成功的数据
      return response.data.data;
    } else {
      // 功能失败
      return Promise.reject(response.data.message);
    }
  },
  // 响应失败 非2xx
  (error) => {
    // console.log(error.message.status); // 响应状态码
    if (error.message) {
      // 服务器返回了响应，但是响应是失败的
      // 401(Unauthorization 未授权，没有权限访问)  没有token 和 token失效或过期
      // 404（找不到：请求地址写错了）  403(禁止访问forbidden)  500（服务器内部错误）
      if (error.message.status === 401) {
      }
    } else {
      // 服务器没有返回响应
      // 请求超时(timeout)还是网络错误(network err)
    }
  }
);

export default request;
