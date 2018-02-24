const debugSeparator = "\n";

const debug = (...args) => {
  console.log(args.join(debugSeparator), debugSeparator);
}

module.exports = debug;