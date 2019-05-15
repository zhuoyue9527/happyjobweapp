import { getIndexList, getPositionList } from '../../services/index.js'
import { formatTime } from '../../utils/util.js'
import { showToast} from '../../utils/tips.js'
import { updataStorageData } from '../../utils/storage.js'
import { imgServerUrl } from '../../config/config.js'
const app = getApp();

Page({
  data: {
    imgServerUrl: imgServerUrl,
    cityName: '无锡',
    currentPage: 1,//当前分页
    totalPage:1,//总页数
    isScroll:true,//是否可以滚动
    showCount: 10,//单页展示记录数,
    clearTimer:false,
    djsEnd:false,
    myFormat: ['天', ':', ':', ' '],
  },
  onLoad: function (options) {
    
  },
  onReady: function () {
    
  },
  onReachBottom: function () {
    var currentPage = this.data.currentPage+1;
    this.setData({
      currentPage
    })
    this.fetchList()
  },
  onShow: function () {  
    if (app.globalData.userInfo) {
      console.log('有info===', app.globalData)
      this.start()
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        console.log('userInfoReadyCallback===', app.globalData)
        this.start()
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          console.log('兼容处理===', app.globalData)
          this.start()
        }
      })
    }
  },
  start(){
    this.setData({
      cityName: updataStorageData('city') || app.globalData.userInfo.city || '无锡'
    })
    this.fetchList()
    this.fetchPt()
  },
  //获取列表数据
  fetchList() {
    if(!this.data.isScroll){
      return false
    }
    let paramsObj = {
      cityName: this.data.cityName,
      showCount: this.data.showCount,
      currentPage: this.data.currentPage,
      groupOn:1
    }
    getIndexList(paramsObj).then(data => {
      console.log(data)      
      let { currentPage,totalPage } = data.page
      let setData={
        currentPage,
        totalPage,
      }
      // 是否可以滚动加载数据
      if ( totalPage==0 || currentPage==totalPage) {
        setData.isScroll=false
      }
      if(currentPage == 1){
        setData.list = data.list.map(item=>{
          item.endTime = formatTime(new Date(item.endTime*1000),'yyyy-MM-dd')
          return item
        })
      } else if (totalPage && currentPage<=totalPage){
        let list = data.list.map(item=>{
          item.endTime = formatTime(new Date(item.endTime*1000),'yyyy-MM-dd')
          return item
        })
        setData.list= this.data.list.concat(list)
      }else{
        setData.list = []
      }
      this.setData({
        ...setData
      })

      // this.setData({
      //   list:data.list.map(item=>{
      //     item.endTime = formatTime(new Date(item.endTime*1000),'yyyy-MM-dd')
      //     return item
      //   })
      // })

    })
  },
  //获取我参与的拼团
  fetchPt(){
    if(!app.globalData.sid){
      return false
    }
    getPositionList({
      groupOn: 1,
      currentPage: 1,
      showCount: 1
    }).then(data => {      
      console.log(data)
      this.setData({
        myList: data.list.map(item => {
          item.groupLeftTime = new Date().getTime() + item.groupLeftTime*1000
          return item
        })
      })
    })
  },
  // imageLoad(){
  //   var that = this
  //   var query = wx.createSelectorQuery()
  //   query.select('.slide-image').boundingClientRect()
  //   query.exec(function (res) {
  //     console.log(res)
  //     that.setData({
  //       swiperH: res[0].height
  //     })
  //   })
  // },
  //去详情页
  toDetail(e) {
    const { id, type,welfare } = e.currentTarget.dataset
    wx.navigateTo({
      url: '../detail/index?hpPositionId=' + id+"&type="+type+"&isWelfare="+welfare,
    })
  },
  //去申请列表
  toApplyList() {
    wx.navigateTo({
      url: '../apply-list/index?type=pt'
    })
  },
  //倒计时结束回调
  myLinsterner(){
    // this.fetchPt()
    this.setData({
      djsEnd:true
    })
    showToast("恭喜您拼团成功！","success")
  },
  onShareAppMessage: function () {
    return {
      title: '快来开心工作看看吧',
      path: '/pages/index/index?shareToken=' + updataStorageData('shareToken'),
      imageUrl: ''
    }
  },
  onError(err) {
    app.aldstat.sendEvent('报错',{
      'err': err
    });
  },
})