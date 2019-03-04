/**
 * Created by JackieWu on 2018/7/15.
 */
const config = require('../index');

module.exports = {
  client: 'xunke-app-react',
  pathname: `http://localhost:${config.clientPort}`,
  pathJs: 'js',
  pathCss: 'css',
  middlePath: '',
  react: {
    react: 'https://unpkg.com/react@16/umd/react.development.js',
    reactDom: 'https://unpkg.com/react-dom@16/umd/react-dom.development.js',
  },
  axios: 'https://cdn.bootcss.com/axios/0.18.0/axios.min.js',
  dayjs: {
    dayjs: 'https://cdn.bootcss.com/dayjs/1.8.5/dayjs.min.js',
    dayjsCn: 'https://cdn.bootcss.com/dayjs/1.8.5/locale/zh-cn.js',
  }
};
