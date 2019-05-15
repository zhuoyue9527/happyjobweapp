function showToast(msg,type,time){
  wx.showToast({
    title: msg,
    icon:type||'none',
    duration: time || 1500
  })
}

module.exports={
  showToast
}