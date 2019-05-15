import { imgServerUrl } from '../../config/config.js'
import { getCenterInfo } from '../../services/index.js'
import { updataStorageData } from '../../utils/storage.js'
var app = getApp()
Page({
  data: {
    imgServerUrl:imgServerUrl
  },
  onShow: function () {
    if (app.globalData.noPhone) {
      app.globalData.noPhone=false
      wx.switchTab({
        url: '/pages/index/index',
      })
      return
    }
    this.fetchData()
  },
  fetchData(){
    getCenterInfo().then(data=>{
      console.log(data)
      data.data.userName = decodeURIComponent( data.data.realName ||  data.data.userName || app.globalData.userInfo.nickName )
      data.data.headerPic = data.data.headerPic || app.globalData.userInfo.avatarUrl
      let { headerPic, userName, approveState, hpUserId, phoneNo, hpUserResumeId }=data.data
      userName=decodeURIComponent(userName)
      this.setData({
        headerPic,
        userName,
        approveState,// 认证状态（0、未申请认证，1、认证通过，2、认证不通过，3、认证待审核） ,
        hpUserId,//是否有简历 0，空没有简历，>1有简历     
        hpUserResumeId 
      })
      
      if(!phoneNo){
        wx.navigateTo({
          url: '../auth/auth',
        })
      }else{
        updataStorageData("phone",phoneNo)
      }
    })
  },
  tojianli(){
    if (this.data.hpUserResumeId ){
      wx.navigateTo({
        url: '../jianli/index?hpUserId='+this.data.hpUserId,
      })
    }else{
      wx.navigateTo({
        url: '../user-info/user-info',
      })
    }
  },
  //去认证页面
  toAuth(){
    let approveState = this.data.approveState
    console.log(approveState)
    if (approveState==0){
      //身份认证
      wx.navigateTo({
        url: '../identification/index',
      })
    } else if (approveState == 1){
      //个人信息页面
      wx.navigateTo({
        url: '../user-form/index',
      })
    } else if (approveState == 2) {
      //认证不通过
      wx.navigateTo({
        url: '../result/index?type=auth&status=0',
      })
    } else if (approveState == 3) {
      //待审核
      wx.navigateTo({
        url: '../result/index?type=auth&status=2',
      })
    }
  },
  onError(err) {
    app.aldstat.sendEvent('报错',{
        'err': err
    });
  },  
})