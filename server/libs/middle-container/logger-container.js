'use strict';

/**
 * @func
 * @desc 获取category对应的logger
 * @param {string} category - 类名
 * @returns {object} logger对象，通过implement实现的getLogger返回的对象至少包含三个方法info，warn，error
 */
function getLogger(category) {
  return console;
}

/**
 * @func
 * @desc 对外接口
 * @param {string} category - 类名
 * @returns {object} logger对象
 */
function _exports(category) {
  return getLogger(category);
}

/**
 * @func
 * @desc 根据需要实现getLogger
 * @param {object} options - 配置项
 * @param {func} options.getLogger - 自定义getLogger
 */
_exports.implement = function(options) {
  options = options || {};
  if (typeof options.getLogger === 'function') {
    getLogger = options.getLogger;
  }
};

/**
 * 保证全局共用同一组logger
 */
module.exports = (() => {
  global.dpObj = global.dpObj || {};

  let dpObj = global.dpObj;

  dpObj.loggerContainer = dpObj.loggerContainer || _exports;

  return dpObj.loggerContainer;
})();
