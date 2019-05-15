//去除字符串中空格
String.prototype.excludeSpace = function () {
  return this.replace(/\s+/g, '')
};

// 去除字符串中特殊字符 
String.prototype.excludeSpecial = function () {
  // 去掉转义字符  
  var s = this.replace(/[\'\"\\\/\b\f\n\r\t]/g, '');
  // 去掉特殊字符  
  s = s.replace(/[\@\#\$\%\^\&\*\{\}\:\"\L\<\>\?]/);
  return s
};