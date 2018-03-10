const fs = require('fs');
const _ = require("lodash/fp");
const debug = require('./debug');
const m4aFile = require('./m4aFile');
const makePath = require('./makePath');

const startTime = new Date();
// const readDir = "n:/zzzTag/temp";
const readDir = "n:/zzzTag/allfiles";
const writeDir = "n:/zzzTag/output";
// const readDir = "C:/Users/dan/Desktop/iPlayer Recordings/temp";
// const writeDir = "C:/Users/dan/Desktop/iPlayer Recordings/tagged";
const completeDir = makePath([readDir, "complete"]);
const failDir = makePath([readDir, "failed"]);
const filesToMatch = /\.m4a$/;


m4aFile.setDefaults({
    readDir,
    writeDir,
    completeDir,
    failDir
})

let chain = Promise.resolve();
let filesProcessed = 0;
let filesFailed = 0;
let filesSkipped = 0;
const errors = [];

fs.readdir(readDir, function (err, files) {
    _.forEach(function (filename) {
        if (filesToMatch.exec(filename)) {
            chain = chain.then(function () {
                filesProcessed++;
                return m4aFile
                    .processFile(filename)
                    .then(function (error) {
                        if (error) {
                            errors.push(error);
                            filesFailed++;
                        }
                    })
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

        if (errors.length) {
            debug("Errors encountered: ", errors);
        }

        debug(`Processed ${filesProcessed} files of which ${filesFailed} failed. Skipped ${filesSkipped} files/directories.`, `In ${days} days, ${hours}:${minutes}:${seconds}`);
    })
});
