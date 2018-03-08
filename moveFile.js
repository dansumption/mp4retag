var fs = require('fs');

module.exports = function move(oldPath, newPath) {

    return new Promise(
        function (resolve, reject) {
            function copy() {
                return new Promise(function () {
                    var readStream = fs.createReadStream(oldPath);
                    var writeStream = fs.createWriteStream(newPath);

                    readStream.on('error', reject('Error reading file for copy: ' + oldPath));
                    writeStream.on('error', reject('Error writing file for copy ' + newPath));

                    readStream.on('close', function () {
                        fs.unlink(oldPath, function() { resolve(); });
                    });
                    readStream.pipe(writeStream);
                });
            };

            fs.rename(oldPath, newPath, function (err) {
                if (err) {
                    if (err.code === 'EXDEV') {
                        copy().then(function () { resolve(); });
                    } else {
                        reject(err);
                    }
                    return;
                } else {
                    resolve();
                }
            })
        }
    );
}