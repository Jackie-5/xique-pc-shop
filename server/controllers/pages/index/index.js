/**
 * Created by JackieWu on 2019/2/25.
 */
require('../../../libs/middleware-page/render-polyfill');
const render = require('../../../libs/middleware-page/render-to-string');
const renderHtml = require('../../libs/render-html');

module.exports = async (ctx, next) => {

  await renderHtml({
    ctx,
    render: await render({
      ctx: ctx,
      params: {

      },
      pageName: 'index',
    }),
    seoPageFile: 'index',
    seoPage: 'index',
    isSeo: false,
  });
};
