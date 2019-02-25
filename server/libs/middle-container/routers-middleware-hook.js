/**
 * Created by JackieWu on 2019/1/14.
 */
const ignore = require('../router-middleware/ico-ignore');

module.exports = () => {
  return [ ignore ];
};
