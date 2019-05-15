import { resumeEdu, eduList} from '../../services/index.js'
import { imgServerUrl } from '../../config/config.js'
import { showToast } from '../../utils/tips.js'
import { argusToTimestamp, formateym } from '../../utils/util.js'

Page({
  data: {
    imgServerUrl: imgServerUrl,
    name:'',
    eduList:[],
    eduIndex:0,
    startDate:'',
    endDate:'',
    hpUserEducationId:null,
    hpUserResumeId:''
  },
  onLoad: function (options) {
    this.fetchEduList()
    console.log(options)
    let { hpUserResumeId, index } = options
    if (typeof index != "undefined") {
      let eduList = wx.getStorageSync('eduList')[index]
      this.setData({
        name: eduList.schName,
        eduIndex: eduList.hpEducationId - 1,
        hpUserResumeId: eduList.hpUserResumeId,
        hpUserEducationId: eduList.hpUserEducationId,
        startDate: formateym(eduList.startTime+'000','-'),
        endDate: formateym(eduList.endTime+'000','-')
      })
    } else {
      this.setData({
        hpUserResumeId: hpUserResumeId
      })
    }
  },
  //入学时间
  startDateChange(e) {
    this.setData({
      startDate: e.detail.value
    })
  },
  //毕业时间
  endDateChange(e) {
    this.setData({
      endDate: e.detail.value
    })
  },
  //学校名称
  changeName(e) {
    this.setData({
      name: e.detail.detail.value.excludeSpecial().excludeSpace()
    })
  },
  //获取教育水平
  fetchEduList() {
    eduList().then(res => {
      console.log(res)
      this.setData({
        eduList: res.list
      })
    })
  },
  //改变学历
  bindEduChange(e) {
    let { value } = e.detail
    this.setData({
      eduIndex: value
    })
  },
  //验证
  check() {
    let { name, startDate, endDate } = this.data
    if (name == "") {
      showToast('请填写学校名称')
      return false
    }
    if (startDate.length == 0) {
      showToast("请选择入学时间")
      return false
    }
    if (endDate.length == 0) {
      showToast("请选择毕业时间")
      return false
    }
    return true
  },
  submit() {
    let flag = this.check()
    if (!flag) {
      return
    }
    let { name, startDate, endDate, eduList, eduIndex, hpUserEducationId, hpUserResumeId } = this.data
    let startTime = Math.floor(argusToTimestamp(startDate.split("-"))/1000)
    let endTime = Math.floor(argusToTimestamp(endDate.split("-"))/1000)
    resumeEdu({
      startTime,
      endTime,
      hpEducationId: eduList[eduIndex].hpEducationId,
      hpUserEducationId,
      hpUserResumeId: Number(hpUserResumeId),
      schName:name,
    }).then(data => {
      console.log(data)
      showToast('保存成功', 'success')
      wx.navigateBack()
    })
  },
})