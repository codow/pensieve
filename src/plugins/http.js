import axios from 'axios'
import Vue from 'vue'

axios.defaults.withCredentials = true
// Set config defaults when creating the instance
const instance = axios.create({
  baseURL: '/api'
})
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
  if (
    config.headers &&
    config.headers['content-type'] === 'application/x-www-form-urlencoded'
  ) {
    //
    let params = new URLSearchParams()
    for (let key in data) {
      params.set(key, data[key])
    }
    data = params
  }
  return _post(url, data, config)
}

// Add a response interceptor
instance.interceptors.response.use(
  function (response) {
    // 判断相应的类型，如果是json格式，则按标准处理
    let responseType = response.config.responseType || 'json'
    if (responseType === 'json') {
      // Do something with response data
      let _response = response.data
      if (_response.result !== 'success') {
        throw new Error(_response.data.message, _response)
      }
      return _response
    } else {
      return response
    }
  },
  function (error) {
    // 构建错误信息
    let exception = {
      errorCode: ' ',
      errorMessage: ''
    }
    if (error) {
      // 提取错误信息
      exception.errorMessage = error.message || ''
    }

    return Promise.reject(error)
  }
)

Vue.prototype.$http = instance
