const debug = require('debug');

const logObject = (obj) => {
  for (const k in obj) {
    debug(k);
  } 
}

module.exports = logObject;