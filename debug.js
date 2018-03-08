const debugSeparator = "\n";

const debug = (...args) => {
  if (args && args.length) {
    console.log(args.join(debugSeparator));
  }
  else {
    console.log('\n');
  }
}

module.exports = debug;