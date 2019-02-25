/**
 * Created by JackieWu on 2018/7/15.
 */

exports.init = async (app) => {
  app.ENV = process.env.NODE_ENV || 'development';
  return async function (ctx, next) {
    ctx.state.ENV = process.env.NODE_ENV || 'development';
    ctx.state.envLinks = require(`../../config/node-env/${ctx.state.ENV}`);
    await next();
  };
};