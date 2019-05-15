import { resumeExp } from '../../services/index.js'
import { imgServerUrl } from '../../config/config.js'
import { showToast } from '../../utils/tips.js'
import { formatNumber, argusToTimestamp, formateym} from '../../utils/util.js'

Page({
  data: {
    imgServerUrl: imgServerUrl,
    comName:'',
    jobName:'',
    startDate:'',
    endDate:'',
    startDateEnd:'',
    hpUserExpId: '',//求职者工作经验表
    hpUserResumeId: '',//用户简历表id 
  },
  onLoad: function (options) {
    let { hpUserResumeId,index } = options
    if(typeof index !="undefined"){
      let expList = wx.getStorageSync('expList')[index]
      this.setData({
        comName: expList.comName,
        jobName:expList.posType,
        hpUserResumeId: expList.hpUserResumeId,
        hpUserExpId: expList.hpUserExpId,
        startDate: formateym(+(expList.startTime+'000'), '-'),
        endDate: formateym(+(expList.endTime+'000'),'-')
      })
    }else{
      this.setData({
        hpUserResumeId
      })
    }

    let year = new Date().getFullYear()
    let month = formatNumber(new Date().getMonth()+1)
    // let day = formatNumber(new Date().getDate())
    // let startDateEnd = year + '/' + month + '/' + day
    let startDateEnd = year + '/' + month
    this.setData({
      startDateEnd: startDateEnd
    })
  },
  //入职时间
  startDateChange(e){
    this.setData({
      startDate:e.detail.value
    })
  },
  //离职时间
  endDateChange(e){
    this.setData({
      endDate: e.detail.value
    })
  },
  //公司名称
  changeComName(e){
    this.setData({
      comName: e.detail.detail.value.excludeSpecial().excludeSpace()
    })
  },
  //工作职位
  changeJobName(e){
    this.setData({
      jobName: e.detail.detail.value.excludeSpecial().excludeSpace()
    })
  },
  //验证
  check(){
    let { comName, jobName, startDate, endDate } = this.data
    if(comName==""){
      showToast('请填写公司名称')
      return false
    }
    if(jobName==""){
      showToast("请填写职位")
      return false
    }
    if(startDate.length==0){
      showToast("请选择入职时间")
      return false
    }
    if (endDate.length == 0) {
      showToast("请选择离职时间")
      return false
    }
    return true
  },
  submit() {
    let flag = this.check()
    if(!flag){
      return
    }
    let { comName, jobName, startDate, endDate, hpUserExpId, hpUserResumeId } = this.data
    let startTime = Math.floor( argusToTimestamp(startDate.split("-"))/1000 )
    let endTime = Math.floor(argusToTimestamp(endDate.split("-")) / 1000)
    resumeExp({
      comName,
      startTime,
      endTime,  
      hpUserExpId,
      hpUserResumeId ,
      posType: jobName,
    }).then(data => {
      console.log(data)
      showToast('保存成功','success')
      wx.navigateBack()
    })
  },
})