/**
 * Created by JackieWu on 2018/7/15.
 */
const KoaBody = require('koa-body');
const path = require('path');

exports.init = async () => (
  KoaBody({
    multipart: true,
    formidable: {
      keepExtensions: true,    // 保持文件的后缀
      maxFieldsSize: 2 * 1024 * 1024, // 文件上传大小
      onFileBegin: (name, file) => { // 文件上传前的设置
        const fileFormat = file.name.split('.');
        file.name = `${Date.now()}.${fileFormat[fileFormat.length - 1]}`;
        file.path = path.join(process.cwd(), 'public', file.name);
      },
    },
  })
);
