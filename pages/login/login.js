import { imgServerUrl } from '../../config/config.js'
import { getUserInfo } from '../../utils/wx.js'
import { updataStorageData } from '../../utils/storage.js'
import { saveLogin } from '../../services/wx.js'
var app = getApp()
Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    imgServerUrl: imgServerUrl
  },
  onLoad: function () {
    
  },
  bindGetUserInfo: function (e) {
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      getUserInfo().then(data => {
        app.globalData.userInfo = data.userInfo;
        if(!updataStorageData('city')){
          updataStorageData('city', data.userInfo.city)
        }
        saveLogin({
          encryptedData: encodeURIComponent(data.encryptedData),
          iv: encodeURIComponent(data.iv),
        }).then(data => {
          console.log(data)
        }).catch(data => {
          console.log(data)
        })
        wx.navigateBack()
      }).catch(data=>{
        console.log(data)
      })
    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
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
  onError(err) {
    app.aldstat.sendEvent('报错',{
        'err': err
    });
  },
})