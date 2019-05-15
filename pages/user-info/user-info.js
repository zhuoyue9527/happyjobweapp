import { imgServerUrl } from '../../config/config.js'
import { resumeBase, eduList,groupApply,positionApply } from '../../services/index.js'
import { uploadImg } from '../../services/uploadFile.js'
import { showToast } from '../../utils/tips.js'
import { argusToTimestamp } from '../../utils/util.js'
import { updataStorageData } from '../../utils/storage.js'
const app = getApp();

Page({
  data: {
    imgServerUrl: imgServerUrl,
    sex: ["男", "女"],
    sex_index: 0,
    eduList: [],
    eduIndex: 1,
    avatar: '',
    name:'',
    year:'',
    iphone:'',
    hpUserResumeId:null
  },
  onLoad: function (options) {
    let {hpUserResumeId=null,progress=0} = options
    this.setData({
      hpUserResumeId
    })
    this.setData({
      avatar: (app.globalData.userInfo && app.globalData.userInfo.avatarUrl) ? app.globalData.userInfo.avatarUrl: `${imgServerUrl}/images/avatar/man.png`,
      endDate: new Date().getFullYear(),
      year: '1993'
    })
    this.fetchEduList()
    let phone = updataStorageData('phone')
    if( phone ){
      this.setData({
        iphone:phone
      })
    }
    if( hpUserResumeId ){
      let resumeBase = wx.getStorageSync('resumeBase')
      if (resumeBase.hpUserResumeId){
        this.setData({
          hpUserResumeId:resumeBase.hpUserResumeId,
          avatar: resumeBase.resPic,
          name: resumeBase.resName,
          sex_index: resumeBase.resGender-1,
          year: new Date(resumeBase.resBornTime).getFullYear(),
          iphone:resumeBase.resPhone,
          eduIndex: resumeBase.hpEducationId ? (Number(resumeBase.hpEducationId)-1):0
        })
      }
    }    
  },
  //获取教育水平
  fetchEduList(){
    eduList().then(res=>{
      console.log(res)
      this.setData({
        eduList:res.list
      })
    })
  },
  //改变学历
  bindPickerChange(e){
    console.log(e)
    let {value} = e.detail
    this.setData({
      eduIndex:value
    })
  },
  //改变性别
  bindSexChange(e) {
    console.log(e)
    let { value } = e.detail
    this.setData({
      sex_index: value
    })
  },
  changeName(e){
    console.log(e)
    let { value } = e.detail.detail
    this.setData({
      name: value.excludeSpecial().excludeSpace()
    }) 
  },
  changeYear(e) {
    console.log(e)
    let { value } = e.detail
    this.setData({
      year: value
    })
  },
  changeIphone(e) {
    console.log(e)
    let { value } = e.detail.detail
    this.setData({
      iphone: value.excludeSpecial().excludeSpace()
    })
  },
  //上传图片
  changeImg(){
    uploadImg().then(res => {
      let image = res.data.imgUrl
      this.setData({
        avatar: image
      })
    })
  },

  //验证
  check(){    
    let { avatar,name,year,iphone } = this.data
    if (avatar == (imgServerUrl+"/images/avatar/man.png")){
      showToast('请上传头像'); 
      return false;
    }
    if (name == "") {
      showToast('请输入用户名');
      return false;
    }
    if (this.data.iphone == "" || this.data.iphone.length != 11) {
      showToast('请输入11位手机号');
      return false;
    }
    return true
  },

  //保存
  submit() {
    let flag = this.check()
    if(!flag){
      return
    }
    let { sex_index, eduList, eduIndex, avatar, name, year, iphone, hpUserResumeId}= this.data
    resumeBase({
      hpEducationId: eduList[eduIndex].hpEducationId,
      hpUserResumeId: hpUserResumeId,
      resBornTime: Math.floor(argusToTimestamp([year]) / 1000),
      resGender: sex_index==0?1:2,
      resName: name,
      resPhone: iphone,
      resPic: avatar
    }).then(data => {
      var hpPositionGroupId = this.options.hpPositionGroupId
      var hpPositionId = this.options.hpPositionId
      var formId = this.options.formId
      console.log(data)
      showToast('保存成功','success')
      if(hpPositionGroupId){
        groupApply(hpPositionGroupId,formId).then(data=>{
          wx.redirectTo({
            url:'/pages/pt-detail/index?hpPositionGroupId='+hpPositionGroupId
          })
        })
      }else if(hpPositionId){
        positionApply(hpPositionId,formId).then(data=>{
          if(data.data.hpPositionGroupId){
            wx.redirectTo({
              url:'/pages/pt-detail/index?hpPositionGroupId='+data.data.hpPositionGroupId
            })
          }else{
            wx.redirectTo({
              url:'/pages/detail/index?hpPositionId='+hpPositionId
            })
          }
            
          
        })
      }else{
        wx.navigateBack()
      }
    })
  },
  onError(err) {
    app.aldstat.sendEvent('报错',{
      'err': err
    });
  },
})