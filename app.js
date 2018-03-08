const fs = require('fs');
const _ = require("lodash/fp");
const debug = require('./debug');
const m4aFile = require('./m4aFile');

const readDir = "n:/zzzTag/temp";
// const readDir = "C:/Users/dan/Desktop/iPlayer Recordings";
const writeDir = "C:/Users/dan/Desktop/iPlayer tagged";
const completeDir  = [readDir, "complete"].join('/');
const failDir = [readDir, "failed"].join('/');
const filesToMatch = /\.m4a$/;

m4aFile.setDefaults({
    readDir,
    writeDir,
    completeDir,
    failDir
})

let chain = Promise.resolve();

fs.readdir(readDir, function(err, files) {
    _.forEach(function(filename) {
        if (filesToMatch.exec(filename)) {
            chain = chain.then(function() {
                return m4aFile.processFile(filename)
            });
        } else {
            debug("Skipping: " + filename);
        }
    }, files);
});
