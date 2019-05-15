// pages/store-form/store-form.js
import { comApply } from '../../services/index.js'
import { showToast } from '../../utils/tips.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:'',
    comName: '',
    contactNo: '',
    position: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
// 姓名编辑
  bindNameInput(e){
    this.setData({
      name:e.detail.value
    })
  },
  // 公司编辑
  bindComInput(e) {
    this.setData({
      comName: e.detail.value
    })
  },
  // 联系方式编辑
  bindPhoneInput(e) {
    this.setData({
      contactNo: e.detail.value
    })
  },
  // 职务编辑
  bindPosInput(e) {
    this.setData({
      position: e.detail.value
    })
  },

  // 提交时间
  bindSubmit(e) {
    if (!this.data.name){
      showToast('请填写姓名')
      return false
    }
    if (!this.data.comName) {
      showToast('请填写公司')
      return false
    }
    if (!this.data.contactNo) {
      showToast('请填写联系方式')
    }

    comApply({
      name: this.data.name,
      comName: this.data.comName,
      contactNo: this.data.contactNo,
      position: this.data.position,
    }).then(data=>{
      showToast('提交成功')
    }).catch(err=>{
      console.log(err)
    })
    
  },
})