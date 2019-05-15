import { getBanner, getIndexList } from '../../services/index.js'
import { imgServerUrl } from '../../config/config.js'
var app = getApp();

Page({
  data: {
    activity: [
      {
        src: imgServerUrl + "/images/home/quanzhi.png",
        text: "全职工作"
      },
      {
        src: imgServerUrl + "/images/home/jianzhi.png",
        text: "兼职工作"
      },
      {
        src: imgServerUrl + "/images/home/fanxian.png",
        text: "入职返现"
      },
      {
        src: imgServerUrl + "/images/home/gangwei.png",
        text: "福利岗位"
      },
      {
        src: imgServerUrl + "/images/home/jipin.png",
        text: "高薪急聘"
      }
    ],
    cityName:'无锡',
    keyWord:'',
    // posNature: 0,//职位性质（1、实习，2、兼职，3、全职）
    // retOn: 0,//是否入职返现
    // hotOn: 1,//是否热门
    // welfareOn: 0,//是否福利岗位
    // urgentOn: 0,//是否高薪急聘
    // groupOn: 0,//是否是拼团岗位
    currentPage: 1,//当前分页
    totalPage:1,//总页数
    isScroll:true,//是否可以滚动
    showCount: 10,//单页展示记录数
    index:-1,//岗位类型
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isTest:false
  },
  onLoad: function (options) {
    
  },
  start(){
    let cityName = wx.getStorageSync('city') || app.globalData.userInfo.city || '无锡'
    console.log(cityName)
    this.setData({
      cityName: cityName
    })
    this.fetchBanner()
    let data = this.workType(this.data.index)
    this.fetchList(data)
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
  onReachBottom: function () {
    var currentPage = this.data.currentPage+1;
    this.setData({
      currentPage
    })
    let data = this.workType(this.data.index)
    this.fetchList(data)
  },
  onShareAppMessage: function (e) {
    console.log(e)
  },  
  // 获取banner图
  fetchBanner(){
    getBanner().then(data=>{
      this.setData({
        imgList:data.list
      })
    })   
  },
  imageLoad() {
    var that = this
    var query = wx.createSelectorQuery()
    query.select('.slide-image').boundingClientRect()
    query.exec(function (res) {
      console.log(res)
      that.setData({
        swiperH: res[0].height
      })
    })
  },
  //获取列表数据
  fetchList(params){
    if(!this.data.isScroll){
      return false
    }
    let paramsObj = {
      cityName: this.data.cityName,
      showCount: this.data.showCount,
      currentPage:this.data.currentPage
    }
    Object.assign(paramsObj, params)

    getIndexList(paramsObj).then(data => {
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
        setData.list = data.list
      } else if (totalPage && currentPage<=totalPage){
        setData.list= this.data.list.concat(data.list)
      }else{
        setData.list = []
      }
      this.setData({
        ...setData
      })
      
    })
  },

  // 去搜索页
  toSearch(){
    wx.navigateTo({
      url: '../search/index',
    })
  },

  // 去城市选择页
  toCity(){
    wx.navigateTo({
      url: '../city/index',
    })
  },

  //去详情页
  toDetail(e){
    const { id, type,welfare } = e.currentTarget.dataset
    wx.navigateTo({
      url: '../detail/index?hpPositionId=' + id+"&type="+type+"&isWelfare="+welfare,
    })
  },

  //改变列表
  changeList(e){
    const { index } = e.currentTarget.dataset
    this.setData({
      currentPage:1,
      index:index,
      isScroll:true
    })
    let data = this.workType(index)
    this.fetchList(data)
  },

  //判断当前工作类型
  workType(index){
    var data = {}
    switch (index) {
      case 0: data.posNature = 3; break;
      case 1: data.posNature = 2; break;
      case 2: data.retOn = 1; break;
      case 3: data.welfareOn = 1; break;
      case 4: data.urgentOn = 1; break;
      default: data.hotOn = 1; break;
    }
    return data
  },

  // 页面测试入口
  goTestUrl(){
    wx.navigateTo({
      url: '../store/storeList',
      // url: '../store-form/store-form',
    })
  },
  onError(err) {
    app.aldstat.sendEvent('报错',{
      'err': err
    });
  },
})