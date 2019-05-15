import { getPositionList } from '../../services/index.js'
import { showToast } from '../../utils/tips.js'
Page({
  data: {
    currentPage: 1,//当前分页
    totalPage: 1,//总页数
    isScroll: true,//是否可以滚动
    showCount: 10,//单页展示记录数
    groupOn:0,
    list:[]
  },
  onLoad: function (options) {
    console.log(options)
    let { type } = options
    if(type){
      this.data.groupOn=1
      this.data.showCount=3
      this.data.isScroll = false
    }
    this.fetchData()
  },
  onReachBottom: function () {
    if(this.data.groupOn==1){
      return false
    }
    var currentPage = this.data.currentPage + 1;
    this.setData({
      currentPage
    })
    this.fetchData()
  },
  onShareAppMessage: function () {

  },
  //获取我参与的拼团
  fetchData() {
    if (!this.data.isScroll && this.data.groupOn ==0 ) {
      return false
    }
    let json = {
      currentPage: this.data.currentPage,
      showCount: this.data.showCount,
    }
    if( this.data.groupOn ){
      json.groupOn = 1
    }
    getPositionList(json).then(data => {
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
  //去详情页
  toDetail(e) {
    const { id, type,welfare } = e.currentTarget.dataset
    if (type != 1 || (e.currentTarget.dataset.lefttime && e.currentTarget.dataset.lefttime>0)){
      wx.navigateTo({
        url: '../detail/index?hpPositionId=' + id+"&type="+type+"&isWelfare="+welfare,
      })
    }else{
      showToast('该职位拼团已结束')
      setTimeout(function(){
        wx.navigateTo({
          url: '../detail/index?hpPositionId=' + id+"&type="+type+"&isWelfare="+welfare,
        })
      },1000)
    }

  },
})