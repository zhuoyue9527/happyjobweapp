import { imgServerUrl } from '../../config/config.js'
import { showToast } from '../../utils/tips.js'
import Poster from '../../components/wxa-plugin-canvas/poster/poster';
import { shareQrCodeB, getGroupDetail } from '../../services/index.js'
import { updataStorageData } from '../../utils/storage.js'
var app = getApp()

Page({
  data: {
    imgServerUrl: imgServerUrl,
    qrCode: '',
    hasAuth: true,
    posterConfig:'',
    userInfo: '',
  },
  onLoad: function (options) {
    this.setData({
      hpPositionGroupId: options.hpPositionGroupId,
      userInfo: app.globalData.userInfo,
    })
    // this.fetchData()
    // this.getCode()
    Promise.all([this.fetchData(), this.getCode()]).then(data=>{
      let posterConfig = {
        width: 700,
        height: 950,
        debug: false,
        // blocks: [
        //   {
        //     x: 192,
        //     y: 600,
        //     height: 33,
        //     baseLine: 'middle',
        //     paddingLeft: 15,
        //     paddingRight: 15,
        //     zIndex: 2,
        //     borderRadius: 4,
        //     backgroundColor: '#fff',
        //     text: {
        //       text: [
        //         {
        //           text: '男女不限',
        //           fontSize: 16,
        //           color: '#0e79d0',
        //         },
        //       ],
        //       baseLine: 'middle',
        //     }

        //   },
        // ],
        texts: [
          {
            x: 90,
            y: 250,
            baseLine: 'middle',
            text: '推荐奖励',
            fontSize: 30,
            color: '#ffffff',
            lineHeight: 30,
            zIndex: 2,
          },
          {
            x: 472,
            y: 250,
            baseLine: 'middle',
            text: '诚信企业',
            fontSize: 30,
            color: '#ffffff',
            lineHeight: 30,
            zIndex: 2,
          },
          {
            x: 350,
            y: 390,
            baseLine: 'middle',
            // text: '王明',
            text: this.data.userInfo.nickName,
            textAlign: 'center',
            width: 700,
            fontSize: 64,
            color: '#ffffff',
            lineHeight: 30,
            zIndex: 2,
          },
          {
            x: 350,
            y: 487,
            baseLine: 'middle',
            text: '我在找好友一起上班',
            textAlign: 'center',
            fontSize: 37,
            color: '#ffffff',
            zIndex: 2,
          },
          {
            x: 192,
            y: 570,
            baseLine: 'middle',
            // text: '无锡先导自动化设备股份有限公司',
            text: this.data.comName,
            fontSize: 26,
            color: '#ffffff',
            zIndex: 2,
          },
          {
            x: 70,
            y: 791,
            baseLine: 'middle',
            text: '立即扫码',
            fontSize: 30,
            color: '#ffffff',
            zIndex: 2,
          },
          {
            x: 500,
            y: 791,
            baseLine: 'middle',
            text: '开心工作',
            fontSize: 30,
            color: '#ffffff',
            zIndex: 2,
          },

        ],
        images: [
          {
            width: 700,
            height: 950,
            x: 0,
            y: 0,
            url: `${imgServerUrl}/images/pt/bg.png`,
            zIndex: 1,
          },
          {
            width: 222,
            height: 222,
            x: 230,
            y: 102,
            // url: `${imgServerUrl}/images/pt/bg.png`,
            url: app.globalData.userInfo.avatarUrl,
            borderRadius: 222,
            zIndex: 2,
          },
          {
            width: 90,
            height: 90,
            x: 70,
            y: 562,
            borderRadius: 90,
            // url: `${imgServerUrl}/images/avatar/man.png`,
            url: this.data.comLogo,
            zIndex: 2,
          },
          {
            width: 196,
            height: 196,
            x: 245,
            y: 712,
            // url: `${imgServerUrl}/images/temp/men.png`,
            url: this.data.qrCode,
            zIndex: 2,
          },
        ],
      }
      if (!this.data.comLogo){
        posterConfig.images.splice(2,1)
      }
      console.log(posterConfig)
      this.setData({
        posterConfig
      })
      
    })
  },
  onShow: function () {
    this.setData({
      hasAuth: true
    })
  },
  //获取历史记录
  fetchData() {
    var that = this
    return new Promise(function (resolve,reject){
      getGroupDetail({
        hpPositionGroupId: that.data.hpPositionGroupId
      }).then(data => {
        console.log(data)
        that.setData({
        comLogo: data.data.comLogo,
        comName: data.data.comName
      })
      resolve(true)
    }).catch(data=>{
        console.log(data)
        reject(data)
      })
    })
   
  },
  onPosterSuccess(e) {
    console.log(e)
    const { detail } = e;
    var that =this
    wx.saveImageToPhotosAlbum({
      filePath: detail,
      success(res) {
        console.log(res)
        wx.hideLoading();
        showToast('已保存到相册,快去分享吧！','success',3000)
      },
      fail(err){
        wx.hideLoading();
        showToast('请授权保存到相册')
        that.setData({
          hasAuth: false
        })
      }
    })    
  },
  onPosterFail(err) {
    console.error(err);
  },

  /**
   * 异步生成海报
   */
  onCreatePoster() {    
    Poster.create();
  },
  getCode() {
    wx.showLoading({ title: 'loading', mask: true });
    var that = this
    return new Promise(function (resolve,reject){
      let targetUrl = 'pages/pt-detail/index?hpPositionGroupId=' + that.data.hpPositionGroupId + '&shareToken=' + updataStorageData('shareToken')
      shareQrCodeB(targetUrl).then(data => {
        that.setData({
          qrCode: data.data.imgUrl
        })        
        resolve(true)
      }).catch(data=>{
        console.log(data)
        reject(data)
      })
    })    
  },
  qrcodeLoad(e){
    wx.hideLoading()
  },

  onError(err) {
    app.aldstat.sendEvent('报错',{
        'err': err
    });
  },
})