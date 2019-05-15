import { sendPhoneCode, getPayrollId } from '../../services/index.js'
import { showToast } from '../../utils/tips.js'
import { imgServerUrl} from '../../config/config.js'
import $wuxCountDown from '../../utils/coutdown.js'
var app = getApp()
Page({

  data: {
    imgServerUrl: imgServerUrl,
    iphone:"",
    yzm:'', 
  },
  onLoad:function(opts){
    console.log(opts)
    this.setData(opts)
    
  },
  //下一步提交
  next(e){
    if (this.data.approveState != 1) {
      showToast('身份认证成功后才可进行查询！！！')
      return
    }
    if (this.data.iphone.length != 11) {
      showToast('请输入11位手机号码！')
      return
    }
    if (this.data.yzm.length != 4) {
      showToast('请输入4位验证码！')
      return
    }
    getPayrollId({
      phoneNo:this.data.iphone,
      phoneCode:this.data.yzm
    }).then(data=>{
      
      wx.navigateTo({
        url: '../wages/index?idNum='+data.data.idNum+"&realName="+data.data.realName,
      })
    })
    
  },
  // 手机号输入
  bindPhoneInput(e){
    this.setData({
      iphone: e.detail.detail.value
    })
  },
  // 验证码号输入
  bindCodeInput(e) {
    this.setData({
      yzm: e.detail.detail.value
    })

  },
  //倒计时
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
          djs: '重新发送（' + sec + '）',
        })
      },
    })
  },
// 验证码发送
  sendCode(e){
    if (this.data.approveState!=1 ){
      showToast('身份认证成功后才可进行查询！！！')
      return
    }
    if(this.data.iphone.length != 11){
      showToast('请输入11位手机号码！')
      return
    }
    if (this.data.djs && this.data.djs !== '重新获取验证码') {
      return false
    }
    sendPhoneCode({
      phoneNo:this.data.iphone
    }).then(data =>{
      
    })
    this.vcode()
  },
  onError(err) {
    app.aldstat.sendEvent('报错',{
      'err': err
    });
  },
})