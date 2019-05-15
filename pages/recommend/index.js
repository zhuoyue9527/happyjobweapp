import { imgServerUrl } from '../../config/config.js'
import { updataStorageData } from '../../utils/storage.js'
var app = getApp()
Page({
  data: {
    imgServerUrl: imgServerUrl,
  },

  onLoad: function (options) {
    console.log(options)

  },

  onReady: function () {

  },
  onShow: function (options) {
    console.log(options)

  },
  onShareAppMessage: function () {
    return {
      title: '推荐有奖',
      path: '/pages/recommend-iphone/index?shareToken=' + updataStorageData('shareToken'),
      imageUrl: ''
    }
  }, 
  toShare(){
    wx.navigateTo({
      url: '../recommend-share/index',
    })
  },

  onError(err) {
    app.aldstat.sendEvent('报错',{
        'err': err
    });
  },
})