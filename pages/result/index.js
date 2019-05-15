import { imgServerUrl } from '../../config/config.js'
Page({
  data: {
    imgServerUrl: imgServerUrl,
    type:'',
    status:''
  },
  onLoad: function (options) {
    console.log(options)
    let { type='auth',status=0 } = options 
    let { hpPositionGroupId =""} = options//拼团成功 拼团id
    /**
     * Region:
     * 
     * 类型：
     * type： pt:拼团 auth：认证 
     * 
     * 状态：
     * status: 0:失败 1：成功 2：进行中
     * 
     * 组合：
     * 1、开团成功 type:pt       status: 1 
     * 2、身份认证中 type:auth     status: 2
     * 3、身份认证失败 type:auth     status: 0
     * 
     * */
    this.setData({
      type,
      status
    })

    //拼团成功跳转参团详情
    if (type == 'pt' && status==1){
      setTimeout(()=>{
        wx.redirectTo({
          url: '../pt-detail/index?hpPositionGroupId=' + hpPositionGroupId,
        })
      },2000)
    }
  },
  //身份认证失败重新认证
  toAuth(){
    wx.redirectTo({
      url: '../identification/index',
    })
  }
})