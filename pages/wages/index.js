import { getPayroll } from '../../services/index.js'
import { showToast } from '../../utils/tips.js'
import { formatTime, argusToTimestamp } from '../../utils/util.js'
Page({
  data: {
    realName: '',
    idNum:'',
    targetTime:0,
    detailFlag:true,
    multiArray: [new Date().getFullYear(),new Date().getMonth()+1],
    // multiArray: [2018,11],
    data: '',
  },
  onLoad: function (options) {
    this.fetchData()
  },
  // 页面数据加载
  fetchData(){
    var curDate = new Date();
    this.setData({
      realName: this.options.realName,
      idNum: this.options.idNum,
      detailFlag: true,
      targetTime: argusToTimestamp(this.data.multiArray)/1000,
    })
    this.toGetPayroll(null)
  },

  

  // 工资条查询
  toGetPayroll(e){
    console.log(this.data.targetTime)
    this.setData({
      detailFlag:false
    })
    getPayroll({
      idNum:this.data.idNum,
      time:this.data.targetTime,
    }).then(data => {
      var payDetailArr = [];
      data.data.payTime = formatTime(new Date(data.data.payTime*1000),'yyyy-MM')
      data.data.payDetail = JSON.parse(data.data.payDetail)
      for ( var p in data.data.payDetail){
        payDetailArr.push({ 'key': p, 'value': data.data.payDetail[p]})
      }
      data.data.payDetail = payDetailArr
      this.setData({
        data:data.data,
        detailFlag: true
      })
    })
  },
  // 时间选择器值变化
  bindMultiPickerChange(e){
    var targetDate = new Date(e.detail.value+'-01 00:00:00');

    this.setData({
      targetTime: Date.parse(targetDate)/1000,
      multiArray: [targetDate.getFullYear(), targetDate.getMonth() + 1],
    })
    this.toGetPayroll()
  },

})