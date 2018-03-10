const _ = require("lodash/fp");
const debugSeparator = "\n";

const debug = (...args) => {
  if (args && args.length) {
    console.log(_.flatten(args).join(debugSeparator));
  }
  else {
    console.log('\n');
  }
}

module.exports = debug;