const path =require('path');
const os =require('os');
// third module
const winston =require('winston');
const mkdirp =require('mkdirp');
const dayjs = require('dayjs');
const loggerContainer =require('../middle-container/logger-container');

const serviceConfig =require('../../config');
const packageJson = require('../../../package.json');


const wloggers = winston.loggers;


// 默认配置
const DEFAULT_LOG_CATEGORY = 'Server';
const DEFAULT_LOG_FILE = DEFAULT_LOG_CATEGORY.toLowerCase() + '.log';
const DEFAULT_DATE_PATTERN = '.yyyy-MM-dd';
const DEFAULT_LOGGERS = {
  // server所有的日志
  [DEFAULT_LOG_CATEGORY]: {
    console: true,
    file: DEFAULT_LOG_FILE
  },
};

/**
 * 判断是否运行在pm2中
 * */
function isInPm2 () {
  return process.env && 'pm_id' in process.env;
}

/**
 * @func
 * @desc 获取当前时间戳
 * @return {string} 返回当前时间戳
 */
function timestamp () {
  return dayjs().format('YYYY-MM-DD HH:mm:ss');
}

/**
 * @func
 * @desc 指定logger输出的格式为'时间 - 级别：主要内容 附加内容'
 * @param {object} options - winston log api的参数项
 * @param {func} options.timestamp - log的时间戳
 * @param {string} options.level - log的级别
 * @param {string} options.message - log的主要内容
 * @param {object} options.meta - log的附加内容
 */
function formatter (options) {
  return options.timestamp() + ' - ' + options.level + ': ' + (undefined !== options.message ? options.message : '') + (options.meta && Object.keys(options.meta).length ? '\n\t' + JSON.stringify(options.meta) : '');
}

/**
 * @class
 * @desc 每个Logger都有info，warn，error三个方法
 */
class Logger {
  /**
   * @constructs
   */
  constructor (category, context) {
    this.category = category;
    this.wlogger = wloggers.get(category);
    this.context = context || null;
  }

  /**
   * @method
   * @desc 在winston log api外面封装了一层（去掉callback）
   * @param {string} level- log的级别，有info，warn，error
   * @param message {(string|object)} - log的主要内容，可以字符串或者Error对象
   * @param meta {object} - log的附加内容
   */
  log (level, message) {
    let error,
      category = this.category,
      logger = this.wlogger,
      defaultLogger = wloggers.get(DEFAULT_LOG_CATEGORY);

    // 兼容message或meta传Error对象的情况
    if (message instanceof Error) {
      error = message;
      message = message.stack || message.message || message.name || 'unkown error';
    } else {
      let meta = arguments[arguments.length - 1];
      if (meta instanceof Error) {
        error = meta;
        message += '\n\t' + (meta.stack || meta.message || meta.name || 'unkown error');
      }
    }

    // message加上logger对应的分类
    arguments[1] = '[' + category + '] ' + message;

    // 防止在console中输出两份一样的日志
    if (category !== DEFAULT_LOG_CATEGORY) {
      logger.log.apply(logger, arguments);
      defaultLogger.transports.console.silent = !logger.transports.console.silent;
    } else {
      if (defaultLogger.transports.console) {
        defaultLogger.transports.console.silent = false;
      }
    }

    if (isInPm2()) {
      //pm2中不打到console
      defaultLogger.transports.console.silent = true;
    }

    // 所有的日志都会同步一份到默认日志里面
    defaultLogger.log.apply(defaultLogger, arguments);

    // error同步一份到cat上
    if (level === 'error') {
      let cat = this.context && this.context.cat;

      if (cat) {
        cat.logError(error);
      }
    }
  }
}
/**
 * @method
 * info，warn，error
 */
['info', 'warn', 'error'].forEach((level) => {
  Logger.prototype[level] = function () {
    Array.prototype.unshift.call(arguments, level);
    this.log.apply(this, arguments);
  };
});

/**
 * @class
 * @desc 管理一组logger，每个请求会实例化自己的logger
 */
class LoggerManager {
  /**
   * @constructs
   */
  constructor (context) {
    this.context = context;
    this.loggers = {};
  }

  /**
   * @method
   * @desc 获取对应的logger
   * @param {string} category - logger分类
   * @return {Logger} 返回对应的logger
   */
  getLogger (category) {
    if (!this.loggers[category] && LoggerManager.categories.indexOf(category) !== -1) {
      this.loggers[category] = new Logger(category, this.context);
    }

    return this.loggers[category] || this.loggers[DEFAULT_LOG_CATEGORY] || console;
  }

  /**
   * @method
   * @desc 返回可挂载的API
   * @returns {object} 返回默认logger和getLogger
   */
  exports () {
    return {
      logger: this.getLogger(DEFAULT_LOG_CATEGORY),
      getLogger: this.getLogger.bind(this)
    }
  }
}
LoggerManager.categories = [];

/**
 * @func
 * @param  {string} dir - log所在目录
 * @param  {string} filename - log文件名
 * @return {string} 返回完整的log路径
 */
function getLogFileName (dir, filename) {
  let pmId = (process.env.pm_id || 0) % (os.cpus().length || 1),
    index = filename.lastIndexOf('.');

  return path.join(dir, filename.substring(0, index) + '-' + pmId + (filename.substring(index) || '.log'));
}

/**
 * @func
 * @desc 初始化所有winston logger
 */
function initWloggers () {
  let logDir = path.join(serviceConfig.LOG_DIR, packageJson.name),
    configs,
    config;

  // 创建应用对应的logger目录
  mkdirp.sync(logDir);


  configs = Object.assign({}, DEFAULT_LOGGERS);

  // 添加logger
  Object.keys(configs).forEach((category) => {
    config = configs[category];

    // type: console
    if (typeof config.console !== 'undefined') {
      // 生产环境不在console里面输出
      if (isInPm2() || config.console === false) {
        config.console = {
          silent: true
        };
      } else {
        // 默认带颜色和时间戳
        config.console = Object.assign({
          colorize: true,
          timestamp: timestamp
        }, config.console);
      }
    }

    // type: file
    if (typeof config.file !== 'undefined') {
      if (config.file === true) {
        config.file = {
          filename: getLogFileName(logDir, category + '.log')
        };
      } else if (typeof config.file === 'string') {
        config.file = {
          filename: getLogFileName(logDir, config.file)
        };
      } else {
        config.file.filename = getLogFileName(logDir, config.file.name);
      }

      // 默认日志文件按天来存
      if (config.file.daily !== false) {
        config.dailyRotateFile = Object.assign({
          datePattern: DEFAULT_DATE_PATTERN,
          timestamp: timestamp,
          json: false,
          formatter: formatter
        }, config.file);
        delete config.file;
      } else {
        config.file = Object.assign({
          timestamp: timestamp,
          json: false,
          formatter: formatter
        }, config.file);
      }
    }

    wloggers.add(category, config);

    LoggerManager.categories.push(category);
  });
}

/**
 * @generator
 * @desc log中间件
 */
async function middleware (ctx, next) {

  Object.assign(ctx, new LoggerManager(ctx).exports());

  await next();
}

/**
 * Logger中间件
 * 初始化所有winston logger
 * @param {object} app - koa实例
 * @return {generator} 返回log中间件
 */
exports.init = function (app) {
  initWloggers();

  let loggerManager = new LoggerManager(app).exports();

  // 实现logger-container的getLogger接口
  loggerContainer.implement({
    getLogger: loggerManager.getLogger
  });

  // 在app上挂不带context的logger
  Object.assign(app, loggerManager);


  return middleware;
};

