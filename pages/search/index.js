import { searchHistory, deleteHistory, getIndexList } from '../../services/index.js'

Page({
  data: {
    historyList:[],
    searchVal:''
  },
  onLoad: function (options) {

  },
  onShow: function () {
    this.fetchData()
  },

  //获取历史记录
  fetchData(){
    searchHistory().then(data=>{
      console.log(data)
      this.setData({
        historyList:data.list
      })
    })
  },

  //删除历史记录
  delHistory(e){
    console.log(e)
    let id = e.currentTarget.dataset.id
    let title = "删除提示"
    let content= ""
    if (id == 'all'){
      id = null
      content= "是否清除全部记录"
    }else{
      content= "是否清除选中记录"
    }
    wx.showModal({
      title: title,
      content: content,
      success:(res)=>{
        if (res.confirm){
          deleteHistory(id).then(data => {
            console.log(data)
            this.fetchData()
          })

        }
      }
    })
  },

  // 搜索框输入值
  bindKeyInput(e){
    this.data.searchVal = e.detail.value;
  },

  // 点击搜索记录
  selectMsg(e){
    this.data.searchVal = e.currentTarget.dataset.value
    this.toSearchPage()
  },
  
  toSearchPage() {
    wx.navigateTo({
      url: '../search-result/search-result?searchVal='+this.data.searchVal,
    })    
  },
})