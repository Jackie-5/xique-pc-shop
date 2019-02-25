/**
 * Created by Jackie.Wu on 2018/7/17.
 */
import React  from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import path from 'path';
import config from '../../config';

export default async (options = {}) => {
  const { params = {}, pageName, ctx } = options;
  const { envLinks, clientPath } = ctx.state;
  const { pathname } = envLinks;

  const render = {
    container: '',
    initState: {
      ...params,
    },
    pageJs: '',
    pageCss: '',
    iconfontCss: config.iconfontCss,
  };
  // 查找对应的router
  if (Array.isArray(clientPath)) {
    clientPath.forEach((item) => {
      if (item.name === pageName) {
        ctx.logger.info(JSON.stringify(item));
        if (item.pageJs) {
          render.pageJs = `${pathname}/${item.pageJs}`;
        } else {
          ctx.throw(500, '静态js文件路径找不到');
        }
        if (item.css) {
          render.pageCss = `${pathname}/${item.css}`;
        }
        if (item.pageJs) {
          const ReactTem = require(path.join(process.cwd(), 'client', item.pageJs));
          render.container = renderToStaticMarkup(<ReactTem { ...render.initState } />);
        } else {
          ctx.throw(500, '客户端引用 react 的路径错误');
        }
      }
    });
  } else if (typeof clientPath === 'object') {
    if (clientPath.pageJs) {
      render.pageJs = `${pathname}/${clientPath.pageJs}`;
    } else {
      ctx.throw(500, '静态js文件路径找不到');
    }
    if (clientPath.css) {
      render.pageCss = `${pathname}/${clientPath.css}`;
    }
    if (clientPath.pageJs) {
      const ReactTem = require(path.join(process.cwd(), 'client', clientPath.pageJs));
      render.container = renderToStaticMarkup(<ReactTem { ...render.initState } />);
    } else {
      ctx.throw(500, '客户端引用 react 的路径错误');
    }

  } else {
    ctx.throw(500, 'router clientPath 错误，既不是Array 也不是 Object');
  }

  return render;
};
