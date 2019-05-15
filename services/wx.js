var api = require('../api/api.js')
import { http } from '../utils/http.js'

/*******************  请求 ***********************************/
//api地址
const url = api.url;

//后台解密手机号 encryptedData iv sessionKey
function decodePhone(params) {
  return http({
    url: url.wxPhoneBound,
    method: "POST",
    data: params,
    header:{
      'oid': getApp().globalData.oid
    }
  })
}

//商城小程序，根据微信CODE获取微信用户信息
function wxLogin(params) {
  return http({
    url: url.userLogin,
    method: "POST",
    data: params,
  })
}

//用户微信信息存入
function saveLogin(params) {
  return http({
    url: url.saveUserInfo,
    method: "POST",
    header: {
      oid: getApp().globalData.oid
    },
    data: params
  })
}

module.exports = {
  decodePhone,
  wxLogin,
  saveLogin,
}