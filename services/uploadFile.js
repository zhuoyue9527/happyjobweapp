import { apiUrl } from '../config/config.js'
import { showToast } from '../utils/tips.js'
const api = require('../api/api.js')
const { imgUpOne } = api.url
var app = getApp()

module.exports={
  //图片上传
  uploadImg(){
    return new Promise((resolve,reject)=>{
      wx.chooseImage({
        sizeType: ['original', 'compressed'],  //可选择原图或压缩后的图片
        sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
        success: res => {
          const image = res.tempFilePaths[0]
          wx.uploadFile({
            url: apiUrl + imgUpOne,
            filePath: image,
            name: 'file',
            header: {
              oid: app.globalData.oid
            },
            formData: {
              code: 'user'
            },
            success: function (res) {
              console.log(res)
              let data = JSON.parse(res.data)
              resolve(data)
            },
            fail: function (res) {
              console.log(res)
              showToast(res.data.message)
              reject(res)
            },
          })
        }
      })
    })    
  }
}

