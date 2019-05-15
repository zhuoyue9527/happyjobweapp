import { url } from '../api/api.js'
import { saveLogin } from '../services/wx.js'

//获取code
function getWxCode(){
  return new Promise((resolve, reject) => {
    wx.login({
      success(res) {
        if (res.code) {
          resolve(res.code)
        } else {
          reject(res.errMsg)
        }
      }
    })
  })
}

//获取用户信息 判断授权
function hasAuth(setting) {
  return new Promise((resolve, reject) => {
    wx.getSetting({
      success: res => {
        if (res.authSetting[setting]) {
          resolve(true)
        } else {
          // 未授权            
          reject(false)
        }
      }
    })
  })
}

//获取用户信息
function getUserInfo(){
  return new Promise((resolve, reject) => {
    wx.getUserInfo({
      lang: 'zh_CN',
      success: res => {
        resolve(res)
      },
      fail: err => {
        console.log('获取用户信息失败')
        reject(false)
      }
    })
  })
}

//checkSession
function checkSession(appData) {
  return new Promise((resolve, reject) => {
    wx.checkSession({
      success() {
        // session_key 未过期，并且在本生命周期一直有效
        resolve(true)
      },
      fail() {
        // session_key 已经失效，需要重新执行登录流程
        reject(false)
      }
    })
  })
}

module.exports = {
  getWxCode,
  hasAuth,
  getUserInfo,
  checkSession,
}
