import { imgServerUrl } from '../../config/config.js'
import { showToast } from '../../utils/tips.js'
import { getStoreDetail, getIp } from '../../services/index.js'
var $ = require('../../libs/gdconf.js');

Page({
  data: {
    imgServerUrl:imgServerUrl
  },
  onLoad: function (options) {
    this.fetchData()    
  },
  onShareAppMessage: function () {

  },
  fetchData(){
    this.setData({
      hpCompanyStoreId: this.options.hpCompanyStoreId
    })
    getStoreDetail({
      hpCompanyStoreId: this.data.hpCompanyStoreId
    }).then(data=>{
      console.log(data)
      this.setData({
        data:data.data
      })
      if(data.data.storeAddr ){
        this.fetchIp()
      }
    })
  },
  fetchIp(){
    let addrIndex = this.data.data.storeAddr.indexOf("市")
    let cityName  = this.data.data.storeAddr.substring(0,addrIndex+1)
    this.data.cityName = cityName
    getIp({
      city:cityName,
      addr:this.data.data.storeAddr
    }).then(data=>{
      this.setData({
        comLocation:data.data
      })
    })
  },
  tomap() {
    if(!this.data.data.storeAddr ){
      showToast('没有门店位置')
      return
    }
    var that = this
    wx.showLoading({ title: 'loading', mask: true });
    //获得当前位置坐标
    $.map.getRegeo({
      success(data) {
        wx.hideLoading();
        var data = data[0], cityd = data.regeocodeData.addressComponent.province;
        let POIlongitude = that.data.comLocation.split(",")[0]
        let POIlatitude = that.data.comLocation.split(",")[1]
        let obj = {
          POIlocation: that.data.comLocation,
          POIlongitude: POIlongitude,
          POIlatitude: POIlatitude,
          address: '',
          city: that.data.cityName,
          cityd: cityd,
          fromhistory: "0",
          latitude: data.latitude,
          longitude: data.longitude,
          name: that.data.data.storeAddr,
          saddress: data.name,
          sname: "我的位置",
        }
        let params = ''
        for (let key in obj) {
          params += key + "=" + obj[key] + "&"
        }
        wx.navigateTo({
          url: '../gdmap/index?' + params,
        })
      },
      fail(data){
        wx.hideLoading();
        that.setData({
          authMask:true
        })
      }
    });  
  },
  hideAuth(){
    this.setData({
      authMask:false
    })
  },
})