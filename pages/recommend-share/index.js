import { imgServerUrl } from '../../config/config.js'
import { showToast } from '../../utils/tips.js'
import Poster from '../../components/wxa-plugin-canvas/poster/poster'
import { shareQrCodeA } from '../../services/index.js'
import { updataStorageData } from '../../utils/storage.js'
var app = getApp()
Page({
  data: {
    imgServerUrl: imgServerUrl,
    qrCode:'',
    hasAuth:'',
    posterConfig: {
      width: 750,
      height: 1200,
      backgroundColor: '#1d449a',
      debug: false,
      blocks: [
        {
          x: 0,
          y: 330,
          width: 750,
          height: 8,
          backgroundColor: '#3f6dd3',
          zIndex: 2,
        },
        {
          x: 15,
          y: 370,
          width: 720,
          height: 800,
          backgroundColor: '#fffcf7',
          borderRadius: 10,
          paddingLeft: 50,
          paddingRight: 50,
          zIndex: 2,
        },
        {
          x: 207,
          y: 825,
          width: 338,
          height: 175,
          borderColor: '#1d449a',
          borderWidth: 1,
          zIndex: 4,
        }
      ],
      texts: [
        // {
        //   x: 220,
        //   y: 240,
        //   baseLine: 'middle',
        //   text: '每邀请1位新用户注册',
        //   fontSize: 33,
        //   color: '#ffffff',
        //   lineHeight: 40,
        //   zIndex: 2,
        // },
        // {
        //   x: 220,
        //   y: 290,
        //   baseLine: 'middle',
        //   text: '即可得5元现金红包',
        //   fontSize: 33,
        //   lineHeight: 40,
        //   color: '#ffffff',
        //   zIndex: 4,
        // },
        {
          x: 230,
          y: 880,
          baseLine: 'middle',
          text: '我在【开心工作】',
          fontSize: 18,
          lineHeight: 40,
          color: '#2a2a2a',
          zIndex: 4,
        },
        {
          x: 230,
          y: 912,
          baseLine: 'middle',
          text: '赚了5块钱',
          fontSize: 18,
          lineHeight: 40,
          color: '#2a2a2a',
          zIndex: 4,
        },
        {
          x: 230,
          y: 940,
          baseLine: 'middle',
          text: '扫码分享给你',
          fontSize: 18,
          lineHeight: 40,
          color: '#2a2a2a',
          zIndex: 4,
        },
      ],
      images: [
        {
          width: 750,
          height: 325,
          x: 0,
          y: 0,
          url: `${imgServerUrl}/images/recommend/awardBg.png`,
          zIndex: 1,
        },
        // {
        //   width: 750,
        //   height: 330,
        //   x: 0,
        //   y: 0,
        //   url: `${imgServerUrl}/images/recommend/tuijian-bg.png`,
        //   zIndex: 1,
        // },
        // {
        //   x: 80,
        //   y: 30,
        //   width: 593,
        //   height: 172,
        //   url: `${imgServerUrl}/images/recommend/title.png`,
        //   zIndex: 2,
        // },
        {
          x: 65,
          y: 400,
          width: 623,
          height: 372,
          url: `${imgServerUrl}/images/recommend/step.png`,
          zIndex: 4,
        },
        {
          x: 374,
          y: 835,
          width: 155,
          height: 155,
          url: '',
          zIndex: 4,
        }
      ],
    }
  },
  onLoad: function (options) {
    this.getCode()
  },
  onShow(){
    this.setData({
      hasAuth:true
    })
  },
  getCode(){
    let targetUrl = 'pages/recommend-iphone/index?shareToken=' + updataStorageData('shareToken')
    shareQrCodeA(targetUrl).then(data=>{
      this.setData({
        qrCode:data.data.imgUrl
      })
    })
  },
  onPosterSuccess(e) {
    console.log(e)
    const { detail } = e; 
    var that = this
    wx.saveImageToPhotosAlbum({
      filePath: detail,
      success(res) {
        console.log(res)
        wx.hideLoading();
        showToast('已保存到相册!','success',3000)
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
    //  `/images/recommend/qrcode.jpg`
    wx.showLoading({ title: 'loading', mask: true });
    this.data.posterConfig.images[this.data.posterConfig.images.length - 1].url = this.data.qrCode
    this.setData({ 
      posterConfig:this.data.posterConfig
    }, () => {
      Poster.create();
    });
  },
  onError(err) {
    app.aldstat.sendEvent('报错',{
        'err': err
    });
  },
})