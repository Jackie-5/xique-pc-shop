/**
 * Created by JackieWu on 2018/7/15.
 */
const render = require('koa-views');
const path = require('path');
const config = require('../../config');

exports.init = () => {
  return render(path.join(process.cwd(), config.viewDir), {
    map: {
      html: 'ejs'
    }
  });
};