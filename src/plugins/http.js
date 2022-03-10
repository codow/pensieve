import axios from 'axios'

axios.defaults.withCredentials = true
// Set config defaults when creating the instance
const instance = axios.create({
  baseURL: 'http://localhost:64081'
});
// 1、默认的url头部
// 2、请求头部处理
// 3、安全请求封装，防csrf
// 重写post方法，必须要csrf才能提交
const _post = instance.post

instance.post = async function (url, data, config) {
  config = config || {}
  data = data || {}
  if (!config.ignore_csrf) {
    // 获取
    let res = await instance.get('/pensieve/account/_csrf')
    let csrfToken = res.data.token
    if (!csrfToken) throw new Error('获取Csrf Token失败')
    let csrfParameterName = res.data.parameterName
    data[csrfParameterName] = csrfToken
  }
  // 数据处理
  if (config.headers && config.headers['content-type'] === 'application/x-www-form-urlencoded') {
    // 
    let params = new URLSearchParams()
    for (let key in data) {
      params.set(key, data[key])
    }
    data = params
  }
  return _post(url, data, config)
}


Vue.prototype.$http = instance
