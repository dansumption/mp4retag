const fs = require('fs');
const _ = require("lodash/fp");
const debug = require('./debug');
const m4aFile = require('./m4aFile');

const startTime = new Date();
const readDir = "n:/zzzTag/allfiles";
const writeDir = "n:/zzzTag/output";
// const readDir = "C:/Users/dan/Desktop/iPlayer Recordings/temp";
// const writeDir = "C:/Users/dan/Desktop/iPlayer tagged";
const completeDir = [readDir, "complete"].join('/');
const failDir = [readDir, "failed"].join('/');
const filesToMatch = /\.m4a$/;


m4aFile.setDefaults({
    readDir,
    writeDir,
    completeDir,
    failDir
})

let chain = Promise.resolve();
let filesProcessed = 0;
let filesSkipped = 0;

fs.readdir(readDir, function (err, files) {
    _.forEach(function (filename) {
        if (filesToMatch.exec(filename)) {
            chain = chain.then(function () {
                filesProcessed++;
                return m4aFile.processFile(filename)
            });
        } else {
            filesSkipped++;
            debug("Skipping: " + filename);
        }
    }, files);

    chain = chain.then(function () {
        const endTime = new Date();
        let timeDiff = (endTime - startTime) / 1000;
        const seconds = Math.round(timeDiff % 60);
        timeDiff = Math.floor(timeDiff / 60);
        const minutes = Math.round(timeDiff % 60);
        timeDiff = Math.floor(timeDiff / 60);
        const hours = Math.round(timeDiff % 24);
        timeDiff = Math.floor(timeDiff / 24);
        const days = timeDiff;
    
        debug(`Processed ${filesProcessed} files, and skipped ${filesSkipped}.`, `In ${days} days, ${hours}:${minutes}:${seconds}`);
    })
});
