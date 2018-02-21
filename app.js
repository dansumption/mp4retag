const fs = require('fs');
const _ = require("lodash");
const processFile = require('./processFile');
const debug = require('./debug');

const readPath = "N:/zzzTag/temp/";
const writePath = "N:/zzzTag/output/";

fs.readdir(readPath, function(err, items) {
    _.forEach(items, function(item) {
        // TODO: don't process directories
        // TODO: don't process non-mp4 files
        processFile(readPath, writePath, item);
    });
});
