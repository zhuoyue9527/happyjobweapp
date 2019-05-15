import { imgServerUrl } from '../../config/config.js'
import { shareBound } from '../../services/index.js'
import { showToast } from '../../utils/tips.js'
import { updataStorageData } from '../../utils/storage.js'
var app = getApp()
Page({
  data: {
    imgServerUrl: imgServerUrl,
    errorFlag:0,
    phoneNo:'',
    shareToken: '',
  },
  onLoad: function (options) {
    if (app.globalData.userInfo) {
      console.log('有info===', app.globalData)
      this.data.shareToken = updataStorageData('shareToken')
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        console.log('userInfoReadyCallback===', app.globalData)
        this.data.shareToken = updataStorageData('shareToken')
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          console.log('兼容处理===', app.globalData)
          this.data.shareToken = updataStorageData('shareToken')
        }
      })
    }
  },
// 手机号输入框
  bindPhoneBlur(e){
    console.log(e)
    this.setData({
      phoneNo:e.detail.detail.value,
    })
  },
  //确认按钮点击
  dataSub(e){

    console.log(this.data.shareToken)
    if (this.data.phoneNo.length != 11) {
      showToast('请输入11位手机号码！')
      return
    }
    shareBound({
      shareToken: this.data.shareToken,
      phoneNo: this.data.phoneNo,
    }).then(data=>{
      this.setData({
        errorFlag: 1,
      })
    }).catch(err=>{
      console.log(err)
      if(err.errorCode == 2){
        this.setData({
          errorFlag:2,
        })
      }
    })
  },
  // 绑定成功后确定进入首页
  bindSuccessTap(e){
    wx.switchTab({
      url: '../index/index'
    })
  },
  // 绑定失败后返回
  bindFailTap(e) {
    this.setData({
      errorFlag: 0,
    })
  },
  goBack(){
    wx.navigateTo({
      url: '../recommend/index',
    })
  },
  goHome(){
    wx.switchTab({
      url: '../index/index',
    })
  },
  onError(err) {
    app.aldstat.sendEvent('报错',{
        'err': err
    });
  },
})