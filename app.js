const fs = require('fs');
const _ = require("lodash");
const processFile = require('./processFile');
const debug = require('./debug');

const readPath = "N:/zzzTag/allfiles";
const writePath = "N:/zzzTag/output";
const filesToMatch = /\.m4a$/;

fs.readdir(readPath, function(err, items) {
    _.forEach(items, function(item) {
        if (filesToMatch.exec(item)) {
            processFile(readPath, writePath, item);
        } else {
            debug("Skipping: " + item);
        }
    });
});
