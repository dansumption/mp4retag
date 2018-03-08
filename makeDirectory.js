const mkdirp = require('mkdirp');

module.exports = function makeDirectory(path) {
    return new Promise(function (resolve, reject) {
        mkdirp(path, function (err) {
            if (err) {
                reject(`Error creating directory ${path}: ${err}`);
            }
            else {
                resolve();
            }
        });
    });
}