import { getCenterInfo, sendPhoneCode, usePhoneBound } from '../../services/index.js'
import { imgServerUrl } from '../../config/config.js'
import { showToast } from '../../utils/tips.js'
import $wuxCountDown from '../../utils/coutdown.js'
import { updataStorageData } from '../../utils/storage.js'

const app = getApp();
Page({
  data: {
    imgServerUrl: imgServerUrl,
    bornYear:'',
    gender:'',
    realName:'',
    zym:'',
    phone:'',
    isShowYzm:false,
    isShowCode:false,
  },
  onLoad: function (options) {
    this.setData({
      phone: updataStorageData("phone")
    }) 
    this.fetchData()
  },
  fetchData(){
    getCenterInfo().then(data=>{
      console.log(data)
      let { bornYear, gender, realName } = data.data
      realName = decodeURIComponent(realName)
      this.setData({
        bornYear, gender, realName
      })
    })
  },
  vcode() {
    if (this.djs && this.djs.interval) return !1
    this.djs = new $wuxCountDown({
      date: +(new Date) + 60000,
      onEnd() {
        this.setData({
          djs: '重新获取验证码',
        })
      },
      render(date) {
        const sec = this.leadingZeros(date.sec, 2) + ' 秒 '
        date.sec !== 0 && this.setData({
          djs: '重新发送（' + sec +'）',
        })
      },
    })
  },
  inputPhone(e){
    console.log(e.detail.value)
    this.setData({
      phone : e.detail.value
    })
  },
  inputYzm(e){  
    console.log(e.detail.value)
    this.setData({
      zym : e.detail.value
    })
  },
  sendCode(){
    if (String(this.data.phone).length!=11 ){
      showToast("请输入11位手机号")
      return false
    }
    if (this.data.djs && this.data.djs !== '重新获取验证码' ){
      return false
    }
    this.setData({
      isShowYzm:true
    })
    this.vcode()
    sendPhoneCode({
      phoneNo:this.data.phone
    }).then(data=>{
      showToast('短信已发送，请填写新手机号和验证码','none',2500)
      console.log(data)
    })
  },
  showCode(){
    this.setData({
      isShowCode:true
    })
  },
  save(){
    if( !this.data.isShowCode ){
      wx.navigateBack()
      return
    }
    let { phone, zym } = this.data
    if (String(phone).length!=11){
      showToast("请输入手机号")
      return false
    }
    if (!this.data.isShowYzm){
      showToast("请先获取验证码")
      return false
    }
    if (String(zym).length!=4){
      showToast("请输入验证码")
      return false
    }
    usePhoneBound({
      phoneNo: phone,
      msgCode: zym
    }).then(data=>{
      console.log(data)
      wx.navigateBack()
    })
  }
})