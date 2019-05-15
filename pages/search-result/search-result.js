import { getIndexList } from '../../services/index.js'
Page({
  data: {
    keyWord:'',
    currentPage: 1,//当前分页
    totalPage: 1,//总页数
    isScroll: true,//是否可以滚动
    showCount: 10,//单页展示记录数,
    list:[],
    cityName:''
  },
  onLoad: function (options) {
    let { searchVal} = options
    this.setData({
      keyWord: searchVal
    })
    this.fetchList()
  },

  //获取列表数据
  fetchList() {
    if (!this.data.isScroll) {
      return false
    }
    let paramsObj = {
      cityName: this.data.cityName,
      showCount: this.data.showCount,
      currentPage: this.data.currentPage,
      keyWord:this.data.keyWord
    }

    getIndexList(paramsObj).then(data => {
      console.log(data)
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
      console.log(...setData)
      this.setData({
        ...setData
      })

    })
  },

  onReachBottom: function () {
    var currentPage = this.data.currentPage + 1;
    this.setData({
      currentPage
    })
    this.fetchList()
  },
  onShareAppMessage: function (e) {
    console.log(e)
  },
  //去详情页
  toDetail(e) {
    const { id, type } = e.currentTarget.dataset
    wx.navigateTo({
      url: '../detail/index?hpPositionId=' + id + "&type=" + type,
    })
  },
})