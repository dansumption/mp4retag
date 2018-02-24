const _ = require("lodash/fp");
var ffmpeg = require('fluent-ffmpeg');

const readTags = (filePath, {onSuccess, onError}) => {
  ffmpeg(filePath)
  .ffprobe(0, function(err, data) {
    if (_.get('format.tags', data)) {
      onSuccess(data.format.tags);
    }
    else {
      if (!err) {
        err = "No tags found on file metadata"
      }
      onError(err);
    }

  });
}

module.exports = readTags;