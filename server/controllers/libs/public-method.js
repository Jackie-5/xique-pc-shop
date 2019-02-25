/**
 * Created by Jackie.Wu on 2018/8/21.
 */
const _ = require('lodash');
const matchNumber = new RegExp("^[0-9]*[1-9][0-9]*$");
const splitNumber = /[^0-9]/ig;

const numberSplit = (num) => {
  num = num + '';
  if (!num.includes('.')) {
    num += '.'
  }
  return num.replace(/(\d)(?=(\d{3})+\.)/g, function ($0, $1) {
    return $1 + ',';
  }).replace(/\.$/, '');
};


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

