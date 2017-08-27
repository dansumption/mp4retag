const fs = require('fs');
const jsmediatags = require("jsmediatags");
var mkdirp = require('mkdirp');
const debug = require('./debug');
const tagsOperations = require('./tags');

const processFile = (path, filename) => {
  const filePath = path + filename;
  // debug("Reading ", item);
  jsmediatags.read(filePath, {
    onSuccess: function(tag) {
      const tags = tag['tags'] || tag;
      // debug(filePath, tag);
      moveFile({file: filename, tags })
      // debug(JSON.stringify(tag['tags']));
    },
    onError: function(error) {
      debug(':( ERROR ',filePath , error.type, error.info);
    }
  });

    const moveFile = ({file, tags}) => {
    const genre = tagsOperations.findGenre(tags);
    const album = tagsOperations.findAlbum(tags);
    const track = tagsOperations.findTrack(tags);
    const title = tagsOperations.findTitle(tags);
    if (!genre) {
      debug("NO GENRE FOR ", file);
    }
    const albumPath = makeFriendlyPath(album);
    createDirectory([genre, albumPath]);
    const fullPath = path + [genre, albumPath].join('/') + '/' + file
    // TODO: re-enable file copy.
    // const input = fs.createReadStream(path + file);
    // const output = fs.createWriteStream(fullPath);
    // input.pipe(output);
    debug("PROCESSED ", `ALBUM ${album}`, `TRACK ${track}`, `GENRE ${genre}`, `TITLE ${title}`, `FILE ${file}`);
  };

  const makeFriendlyPath = (path) => {
    const match = new RegExp(/[:*<>?\\/]/, 'g');
    const safePath = path.replace(match, "_");
    return safePath;
  }

  const createDirectory = (parts) => {
    const fullPath = path + parts.join('/');
    debug("Directory ", fullPath);
    mkdirp(fullPath, function(err) {
      debug("Directory error ", err);
    });
  }
};

module.exports = processFile;