const fs = require('fs');
const _ = require("lodash/fp");
const processFile = require('./processFile');
const debug = require('./debug');

const readPath = "N:/zzzTag/temp";
const writePath = "N:/zzzTag/output";
const failPath = [readPath, "failed"].join('/');
const filesToMatch = /\.m4a$/;

fs.readdir(readPath, function(err, items) {
    _.forEach(function(item) {
        if (filesToMatch.exec(item)) {
            processFile(readPath, writePath, failPath, item);
        } else {
            debug("Skipping: " + item);
        }
    }, items);
});
