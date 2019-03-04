/**
 * Created by JackieWu on 2019/2/25.
 */

module.exports = async (options) => {

  /*
  * @param option
  * ctx:  node ctx,
  * render: 转译好的react文件跟参数
  * */

  const { ctx, render, seoPageFile, seoPage, isSeo, containerHtml } = options;

  const { initState } = render;

  let seoContainer = {
    title: '',
    keywords: '',
    description: '',
    cityName: '',
    coord: '',
  };

  if (seoPageFile && seoPage && isSeo) {
    const seoContent = require('../config/seo')(ctx, seoPageFile);
    seoContainer = Object.assign(seoContainer, seoContent[seoPageFile][seoPage](render));
  }


  await ctx.render(`${containerHtml ? containerHtml : 'container'}`, Object.assign(seoContainer, render));
};
