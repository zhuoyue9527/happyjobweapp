// pages/store/storeList.js
import { getStoreList } from '../../services/index.js'
import { imgServerUrl } from '../../config/config.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentPage: 1,//当前分页
    showCount: 10,//单页展示记录数,
    isScroll: true,//是否可以滚动
    imgServerUrl: imgServerUrl,
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
    this.fetchList()
  },
  onReachBottom: function () {
    var currentPage = this.data.currentPage + 1;
    this.setData({
      currentPage
    })
    this.fetchList()
  },

  //获取列表数据
  fetchList(){
    if (!this.data.isScroll) {
      return false
    }
    let paramsObj = {
      showCount: this.data.showCount,
      currentPage: this.data.currentPage
    }
    Object.assign(paramsObj, {'isPage':1})

    getStoreList(paramsObj).then(data => {
      let { currentPage, totalPage } = data.page
      let setData = {
        currentPage,
        totalPage,
      }
      // 是否可以滚动加载数据
      if (totalPage == 0 || currentPage == totalPage) {
        setData.isScroll = false
      }
      if (currentPage == 1) {
        setData.list = data.list
      } else if (totalPage && currentPage <= totalPage) {
        setData.list = this.data.list.concat(data.list)
      } else {
        setData.list = []
      }
      this.setData({
        ...setData
      })

    })
  },
  // 进入门店详情页
  toDetail(e){
    var id = e.currentTarget.dataset.id
    console.log(id)
    wx.navigateTo({
      url: '../store-detail/store-detail?hpCompanyStoreId='+id,
    })
  },
    
})