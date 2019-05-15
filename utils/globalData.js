const {
  isDefined,
  isString,
  isObject,
} = require('./base.js');

const app = getApp();

const updataGlobalData = (key, value) => {
  const globalData = app.globalData;
  // 校验 globalData
  if (!globalData) {
    return console.error('[$updateGlobalData] globalData Not Find!'); // eslint-disable-line
  }
  // 校验: 操作字段
  if (!isString(key) || key === '') {
    return console.error('[$updateGlobalData] key 不能为空!'); // eslint-disable-line
  }
  // 取出已有信息
  const data = globalData[key] || {};
  // 更新缓存
  if (value && isObject(value) && isObject(data)) {
    // Object合并第一层
    globalData[key] = Object.assign({}, data, value);
  } else if (isDefined(value)) {
    // 其他非undefined数据直接覆盖
    globalData[key] = value;
  }
  return globalData[key];
};

module.exports = {
  app,
  updataGlobalData,
};
  