import { resumeIntent, getSalaryList} from '../../services/index.js'
import { imgServerUrl } from '../../config/config.js'
import { showToast } from '../../utils/tips.js'

Page({
  data: {
    imgServerUrl: imgServerUrl,
    region: [],
    name:'',
    salaryIndex:0,
    hpUserIntentionId:'',
    hpUserResumeId:''
  },

  onLoad: function (options) {
    this.fetchSalaryList()
    console.log(options)
    let { hpUserResumeId, index } = options
    if (typeof index != "undefined") {
      let intentionList = wx.getStorageSync('intentionList')[index]
      this.setData({
        name: intentionList.posType,
        salaryIndex: intentionList.hpPositionSalaryId-1,
        hpUserResumeId: intentionList.hpUserResumeId,
        hpUserIntentionId: intentionList.hpUserIntentionId,
        region: intentionList.workArea.split(",")
      })
    } else {
      this.setData({
        hpUserResumeId: hpUserResumeId
      })
    }
  },
  //获取薪资水平
  fetchSalaryList(){
    getSalaryList().then(data=>{
      this.setData({
        salaryList: data.list
      })
    })
  },
  //改变薪资水平
  bindSalaryChange(e){
    this.setData({
      salaryIndex:e.detail.value
    })
  },
  changeName(e){
    this.setData({
      name: e.detail.detail.value.excludeSpecial().excludeSpace()
    })
  },
  submit(){
    let flag = this.check()
    if(!flag){
      return
    }
    let { name,salaryList,salaryIndex,region} = this.data
    resumeIntent({
      hpPositionSalaryId: salaryList[salaryIndex].hpPositionSalaryId,
      hpUserIntentionId: this.data.hpUserIntentionId,
      hpUserResumeId: this.data.hpUserResumeId,
      posType:name,
      workArea:region.join(",")
    }).then(data=>{
      console.log(data)
      showToast('保存成功','success')
      wx.navigateBack()
    })

  },
  bindRegionChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },
  //验证
  check(){
    let { name,region}=this.data
    if (name.trim()==""){
      showToast('请填写期望行业')
      return false
    }
    if (region.length==0){
      showToast('请选择期望地点')
      return false
    }
    return true
  }
})