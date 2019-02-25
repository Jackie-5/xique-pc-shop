/**
 * Created by JackieWu on 2018/7/15.
 */
const path = require('path');

module.exports = {
  port: 12001,
  STATIC_DIR: path.join(process.cwd(), 'client'),
  STATIC_DIR_CLIENT: path.join(process.cwd(), 'server', 'static'),
  DIST_STATIC: path.join(process.cwd(), 'dist'),
  CLIENT_ROUTER: {
    routerDir: 'server/config/routers/client',
    actionDir: 'server/controllers',
  },
  SERVICE_ROUTER: {
    configDir: 'server/config/routers/service',
    actionDir: 'server/controllers'
  },
  LOG_DIR: '/data/applogs',
  iconfontCss: '//at.alicdn.com/t/font_775243_ppnm5yy3yc.css',
  viewDir: '/server/render-views',
};
