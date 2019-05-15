import { imgServerUrl } from '../../config/config.js'
import { decodePhone } from '../../services/wx.js'
import { updataStorageData } from '../../utils/storage.js'
var app = getApp()

Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getPhoneNumber'),
    imgServerUrl: imgServerUrl,
    isShow: true
  },
  onLoad: function (options) {
    let { authProgress=0 } = options
    this.data.authProgress=authProgress
    app.globalData.noPhone=true
  },
  getPhoneNumber: function (e) {
    console.log(e)
    let iv = e.detail.iv ||''
    let encryptedData = e.detail.encryptedData||''
    if (iv) {
      //用户按了允许授权按钮
      this.decodePhoneCallback({
        iv: iv,
        encryptedData: encryptedData,        
      }).then(data=>{
        app.globalData.noPhone=false 
        var targetUrl = wx.getStorageSync('resumeUrl')
        if(targetUrl){
          wx.redirectTo({
            url: targetUrl,
          })
        }else {
          wx.navigateBack()
        }
      })
    } else {
      wx.setStorageSync('resumeUrl','')
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法正常使用小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击了“返回授权”')
          }
        }
      })
    }
  },
  // 手机号解密回调 返回成功失败
  decodePhoneCallback(params){
    return new Promise((resolve, reject) => {
      decodePhone({
        'encryptedData': encodeURIComponent(params.encryptedData),
        'iv': encodeURIComponent(params.iv),
      }).then(data => {
        console.log('手机号解密：',data)
        app.globalData.sid = data.data.sid,
        app.globalData.oid = data.data.oid,
        app.globalData.shareToken = data.data.shareToken,
        updataStorageData('shareToken', data.data.shareToken)
        updataStorageData('phone', data.data.phoneNo)
        resolve(true)
      }).catch(data => {
        reject(false)
      })
    })
  },
  onError(err) {
    app.aldstat.sendEvent('报错',{
      'err': err
    });
  },

})