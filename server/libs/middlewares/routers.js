/**
 * Created by JackieWu on 2018/7/15.
 */

const Routers = require('koa-router');
const fs = require('fs');
const config = require('../../config');
const path = require('path');
const middlewareHook = require('../middle-container/routers-middleware-hook');

const routerInit = new Routers();

/**
 * 引入Action files.
 * @param {Array} config 配置DATA
 * @param {String} prefix Url Prefix
 */
function setRouteByConfig(routerConfig, prefix = '', actionPath) {
  const router = new Routers();
  for (let i = 0; i < routerConfig.length; i += 1) {
    const rConfig = routerConfig[i];
    const methods = !Array.isArray(rConfig.method) ? [rConfig.method] : rConfig.method;
    const actions = !Array.isArray(rConfig.action) ? [rConfig.action] : rConfig.action;
    const actionArrays = [];
    for (let j = 0; j < actions.length; j += 1) {
      let actionFile = null;
      try {
        /* eslint-disable global-require, import/no-dynamic-require */
        actionFile = require(`${actionPath}${actions[j]}`);
      } catch (e) {
        console.error(e);
        console.error(`找不到Action file: .${actionPath}${actions[j]}`);
      }
      if (actionFile) {
        actionArrays.push(actionFile);
      }
    }
    // Register url with methods and actinos.

    const middleHook = middlewareHook(prefix);

    if (Array.isArray(rConfig.url)) {
      rConfig.url.forEach((url) => {
        router.register(url, methods, [
          async (ctx, next) => {
            if (rConfig.clientPath) {
              ctx.state.clientPath = rConfig.clientPath;
            }
            await next();
          },
          ...middleHook,
          ...actionArrays]);
      });
    } else {
      router.register(rConfig.url, methods, [
        async (ctx, next) => {
          if (rConfig.clientPath) {
            ctx.state.clientPath = rConfig.clientPath;
          }
          await next();
        },
        ...middleHook,
        ...actionArrays]);
    }
  }

  routerInit.use(prefix, router.routes(), router.allowedMethods());
}


/**
 * 引入Router config files.
 * @param  {String} dirPath Router configs dir path
 */
function readRouteConfigFiles(dirPath, actionPath) {
  let checkPrefix = [];
  fs.readdirSync(dirPath).forEach((file) => {
    let prefix = '';
    let routers = [];
    let rConfig = null;
    if (fs.lstatSync(`${dirPath}/${file}`).isFile()) {
      /* eslint-disable global-require, import/no-dynamic-require */
      rConfig = require(`${dirPath}/${file}`);
      if (rConfig.prefix && rConfig.prefix !== '/') {
        prefix = `/${rConfig.prefix}`;
      }
      routers = Array.isArray(rConfig.routers) ? rConfig.routers : [];

      if (checkPrefix.indexOf(prefix) > -1) {
        throw `Url Prefix: ${prefix} 重复 , File: ${file}`;
      }

      if (routers.length > 0) {
        setRouteByConfig(routers, prefix, actionPath);
      }
      checkPrefix.push(prefix);
    }
  });
}

readRouteConfigFiles(
  path.join(process.cwd(), config.SERVICE_ROUTER.configDir),
  path.join(process.cwd(), config.SERVICE_ROUTER.actionDir),
);

readRouteConfigFiles(
  path.join(process.cwd(), config.CLIENT_ROUTER.routerDir),
  path.join(process.cwd(), config.CLIENT_ROUTER.actionDir),
);

module.exports = routerInit;
