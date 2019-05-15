import { getResume } from '../../services/index.js'
import { imgServerUrl } from '../../config/config.js'
import { showToast } from '../../utils/tips.js'
import { formatTime } from '../../utils/util.js'
const app = getApp();

Page({
  data: {
    imgServerUrl: imgServerUrl,
    hpUserId:'',//是否有简历
    eduName:'',//学历
    expYear:"",//工作几年
    hpUserResumeId:'',//用户简历表id
  },
  onLoad: function (options){
    console.log(options)
    let { hpUserId=0 } = options
    this.setData({
      hpUserId
    })
    if (!hpUserId){
      wx.navigateTo({
        url: '../user-info/index',
      })
    }
  },
  onShow:function(options){
    this.fetchData()
  },
  fetchData(){
    getResume().then(data=>{
      console.log(data)
      if(!data.data){
        wx.navigateTo({
          url: '../user-info/index',
        })
      }
      let { eduList, expList, intentionList, resumeBase }= data.data
      var eduName = '', expYear=''
      eduName = resumeBase.eduName
      
      if (expList.length){
        let diff = expList[expList.length - 1].startTime - expList[0].startTime
        expYear = Math.floor(diff / 60 / 60 / 24 / 365)
      }
      if (!resumeBase.resPic){
        resumeBase.resPic = app.globalData.userInfo.avatarUrl
      }
      
      if (resumeBase.resBornTime){
        resumeBase.resBornTime = formatTime(new Date(+(resumeBase.resBornTime+'000')),'yyyy')
      }
      this.setData({
        eduList,
        expList,
        intentionList,
        resumeBase,
        eduName,
        expYear,
        hpUserResumeId: resumeBase.hpUserResumeId
      })
      wx.setStorageSync('eduList', eduList)
      wx.setStorageSync('expList', expList)
      wx.setStorageSync('intentionList', intentionList)
      wx.setStorageSync('resumeBase', resumeBase)
    })
  },
  
  // 修改基本信息
  toUserInfo(){
    wx.navigateTo({
      url: '../user-info/user-info?hpUserResumeId=' + this.data.hpUserResumeId,
    })
  },
  // 修改求职意向
  toUserJob(e){
    let { type, index } = e.currentTarget.dataset
    if(type=="edit"){
      wx.navigateTo({
        url: '../user-job/index?hpUserResumeId=' + this.data.hpUserResumeId+"&index="+index,
      })
    }else{
      wx.navigateTo({
        url: '../user-job/index?hpUserResumeId=' + this.data.hpUserResumeId,
      })
    }
  },
  // 修改工作经验
  toUserWorks(e){
    let { type, index } = e.currentTarget.dataset
    if (type == "edit") {
      wx.navigateTo({
        url: '../user-works/index?hpUserResumeId=' + this.data.hpUserResumeId + "&index=" + index,
      })
    }else{
      wx.navigateTo({
        url: '../user-works/index?hpUserResumeId=' + this.data.hpUserResumeId
      })
    }
  },
  //修改教育背景
  toUserEdu(e){
    let { type, index } = e.currentTarget.dataset
    if (type == "edit") {
      wx.navigateTo({
        url: '../user-education/index?hpUserResumeId=' + this.data.hpUserResumeId + "&index=" + index,
      })
    }else{
      wx.navigateTo({
        url: '../user-education/index?hpUserResumeId=' + this.data.hpUserResumeId,
      })
    }
  },
  onError(err) {
    app.aldstat.sendEvent('报错',{
        'err': err
    });
},
})