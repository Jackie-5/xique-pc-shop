/**
 * Created by Jackie.Wu on 2018/8/21.
 */
const _ = require('lodash');

module.exports = {
  numberSplit,
  matchNumber,
  splitNumber,
  parseJSON: (json) => {
    let params = undefined;
    try {
      params = JSON.parse(decodeURIComponent(json));
    } catch (e) {
    }
    return params
  },

};

