const debugSeparator = "\n";

const debug = (...args) => {
  console.log(args.join(debugSeparator));
}

module.exports = debug;