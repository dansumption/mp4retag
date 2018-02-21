const fs = require('fs');
var mkdirp = require('mkdirp');
const debug = require('./debug');
const tagsOperations = require('./tags');

const processFile = (path, filename) => {
  const filePath = path + filename;
  // debug("Reading ", item);
  tagsOperations.readTags(filePath, {
    onSuccess: function(tag) {
      const tags = tag['tags'] || tag;
      // debug(filePath, tag);
      moveFile({file: filename, tags })
      // debug(JSON.stringify(tag['tags']));
    },
    onError: function(error) {
      debug(':( ERROR ',filePath , error);
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
    const albumPath = makeFriendlyFilename(album);
    // const albumPathParts = // TODO ... use regexp to split into programme and series number 
        // TODO: re-enable create directory.
    // createDirectory([genre, albumPath]);
    const fullPath = path + [genre, albumPath].join('/') + '/' + file;
    // TODO: re-enable file copy.
    // const input = fs.createReadStream(path + file);
    // const output = fs.createWriteStream(fullPath);
    // input.pipe(output);
    debug("PROCESSED ", `\n\tALBUM ${album}`, `\n\tTRACK ${track}`, `\n\tGENRE ${genre}`, `\n\tTITLE ${title}`);
    debug(`Finished ${filename}`, "\n");
  };

  const makeFriendlyFilename = (path) => {
    const match = new RegExp(/[:*<>?\\/]/, 'g');
    const safePath = path.replace(match, "_");
    return safePath;
  }

  const createDirectory = (parts) => {
    const fullPath = path + parts.join('/');
    debug("Directory ", fullPath);
    mkdirp(fullPath, function(err) {
      debug(`Directory error creating ${parts}`, err);
    });
  }
};

module.exports = processFile;