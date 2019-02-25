/**
 * Created by JackieWu on 2018/7/15.
 */

exports.init = async () => {
  return async (ctx, next) => {
    try {
      await next();
      const status = ctx.status;
      if (status === 404) {
        await ctx.render('error/404');
      }
    } catch (err) {
      ctx.status = err.status || 500;
      if (ctx.status === 404) {
        //Your 404.jade
        ctx.logger.error('404:' + err.message);
        await ctx.render('error/404', {
          message: err.message || ''
        });
      }

      if(ctx.status === 501){
        ctx.logger.error('501:' + err.message);
        ctx.body = err.message;
      }
      ctx.logger.error('500:' + err.message);
      await ctx.render('error/500', {
        message: err.message || ''
      });
    }
  };
};