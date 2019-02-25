/**
 * Created by JackieWu on 2018/7/15.
 */
const axios = require('axios');

exports.init = async (app) => {
  return async (ctx, next) => {
    ctx.state.axios = (url, params = {}, options = {}) => {
      const config = Object.assign({
        url: url,
        method: 'get',
        headers: {}
      }, options);
      switch (config.method) {
        case 'get': {
          config.params = params;
          break;
        }
        case 'post':
        case 'put':
        case 'patch': {
          if (options.isFrom) {
            config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
            config.transformRequest = [function (data) {
              // Do whatever you want to transform the data
              let ret = '';
              for (let it in params) {
                ret += encodeURIComponent(it) + '=' + encodeURIComponent(params[it]) + '&'
              }
              return ret
            }]
          } else {
            config.headers['Content-Type'] = 'application/json;charset=UTF-8';
          }
          config.data = params;
          break;
        }
        default: {
          break;
        }
      }

      return new Promise((resolve, reject) => {
        const startTime = Date.now();
        axios(config).then(function (response) {
          ctx.logger.info(`[axios] ${config.url} success ${Date.now() - startTime}ms`);
          resolve(response.data);
        }).catch((error) => {
          ctx.logger.error(`[axios-failed-url] ${config.url}`);
          console.log(config.params);
          ctx.logger.error(error);
          reject(error);
        });
      });

    };
    await next();
  };
};
