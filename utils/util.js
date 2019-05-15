const formatTime = (date, fmt) => {

  if (!date) {
    return fmt;
  }

  var o = {
    "M+": date.getMonth() + 1, //月份 
    "d+": date.getDate(), //日 
    "H+": date.getHours(), //小时 
    "m+": date.getMinutes(), //分 
    "s+": date.getSeconds(), //秒 
    "q+": Math.floor((date.getMonth() + 3) / 3), //季度 
    "S": date.getMilliseconds() //毫秒 
  };

  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

//将年月日数组转成时间戳
const argusToTimestamp = arr => {
  var lenth = arr.length;
  if (lenth< 3) {                
      for (var i =0; i < 3-lenth; i++) {
          arr.push("01")
      }
  }
  return Date.parse(new Date(arr.join("/")))
}

// 时间戳转成年月
function formateym(dates, split = ".") {
  var date = new Date(+dates)
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  return date.getFullYear() + split + formatNumber(date.getMonth() + 1)
}

module.exports = {
  formatTime: formatTime,
  formatNumber,
  formateym,
  argusToTimestamp
}
