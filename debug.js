const debugSeparator = "\t";

const debug = (...args) => {
  console.log(args.join(debugSeparator));
}

module.exports = debug;