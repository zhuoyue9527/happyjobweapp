// pages/roadsLine/index.js
const WxParse = require('../../plugins/wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let That = this
    wx.getStorage({
      key: 'carDesc',
      success(res) {
        That.fetchData(res.data)  
      }
    })
  },

// 
fetchData(carDesc){
  this.setData({
    carDesc: carDesc
  })
  WxParse.wxParse('carDesc', 'html', carDesc, this)

},

})