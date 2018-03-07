const _ = require("lodash/fp");
var ffmpeg = require('fluent-ffmpeg');

const readTags = (filePath) => {
    return new Promise(function(resolve, reject) {
      ffmpeg(filePath)
      .ffprobe(0, function(err, data) {
        if (_.get('format.tags', data)) {
          resolve(data.format.tags);
        }
        else {
          if (!err) {
            err = "No tags found on file metadata"
          }
          reject(err);
        }
      }); 
    });
}

module.exports = readTags;