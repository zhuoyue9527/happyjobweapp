const {
  isUndefined,
  isString,
  isObject,
} = require('./base.js');

const updataStorageData = (key, value) => {
  try {
    if (!isString(key) || key === '') {
      return console.error('[$updateStorageData] key 不能为空!'); // eslint-disable-line
    }
    let data = wx.getStorageSync(key);
    // 只有key情况下，直接返回data
    if (isUndefined(value)) return data;
    // Object合并
    if (isObject(value) && isObject(data)) {
      let info = Object.assign({}, data, value);
      wx.setStorageSync(key, info);
      return info;
    }
    // 其他数据直接覆盖
    wx.setStorageSync(key, value);
    return value;
  } catch (e) {
    console.error(`[ERROR]: ${value ? 'UPDATE' : 'GET'} Storage ${key} : `, e.stack); // eslint-disable-line
  }
};

module.exports = {
  updataStorageData
};
