const fs = require('fs');
var mkdirp = require('mkdirp');
const debug = require('./debug');
const readTags = require('./readTags');
const mapTags = require('./mapTags');

const processFile = (path, filename) => {
  const filePath = path + filename;
  readTags(filePath, {
    onSuccess: function(tags) {
      moveFile({file: filename, tags })
    },
    onError: function(error) {
      debug(':( ERROR ',filePath , error);
    }
  });

  const moveFile = ({file, tags}) => {
    const genre = mapTags.mapGenre(tags);
    const { programme, series } = mapTags.findProgrammeAndSeries(tags);
    const track = mapTags.findTrack(tags);
    const title = mapTags.findTitle(tags);
    if (!genre) {
      debug("NO GENRE FOR ", file);
    }
    // const albumPath = makeFriendlyFilename(album);
    // const albumPathParts = // TODO ... use regexp to split into programme and series number 
        // TODO: re-enable create directory.
    // createDirectory([genre, albumPath]);
    // const fullPath = path + [genre, albumPath].join('/') + '/' + file;
    // TODO: re-enable file copy.
    // const input = fs.createReadStream(path + file);
    // const output = fs.createWriteStream(fullPath);
    // input.pipe(output);
    debug("PROCESSED ", `\n\PROGRAMME ${programme}`, `\n\tSERIES ${series}`, `\n\tTRACK ${track}`, `\n\tGENRE ${genre}`, `\n\tTITLE ${title}`);
    // debug(`Finished ${filename}`, "\n");
    debug("\n");
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