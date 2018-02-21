const fs = require('fs');
var mkdirp = require('mkdirp');
const debug = require('./debug');
const readTags = require('./readTags');
const mapTags = require('./mapTags');

const processFile = (readPath, writePath, filename) => {
  const filePath = readPath + filename;
  readTags(filePath, {
    onSuccess: function(tags) {
      moveFile({filename, readPath, writePath, tags })
    },
    onError: function(error) {
      debug(':( ERROR ',filePath , error);
    }
  });

  const moveFile = ({filename, tags, readPath, writePath}) => {
    const genre = mapTags.mapGenre(tags);
    const artist = mapTags.mapArtist(genre);
    const { programme, seriesNumber, parentSeries } = mapTags.findProgrammeAndSeries(tags);
    const track = mapTags.findTrack(tags);
    const title = mapTags.findTitle(tags);
    if (!genre) {
      throw new Error("NO GENRE FOR " + filename);
    }
    const pathParts = makePathParts({  genre, parentSeries, programme, seriesNumber });
    const outputPath = [writePath, ...pathParts].join('/');
    const outputFilename = sanitiseFilename(filename);
    const outputFilenameWithPath = [outputPath, outputFilename].join('/');

    // createDirectory([genre, albumPath]);
    // TODO: re-enable file copy.
    // const input = fs.createReadStream(path + file);
    // const output = fs.createWriteStream(fullPath);
    // input.pipe(output);
    debug(
      filename,
      `\n',
      '\tPROGRAMME ${programme}`, `\n\tSERIES ${seriesNumber} (${parentSeries})`, `\n\tTRACK ${track}`, `\n\tGENRE ${genre}`, `\n\tTITLE ${title}`,
      '\n',
      outputFilenameWithPath,
      '\n'
    );
  };

  const makePathParts = ({ genre, parentSeries, programme, seriesNumber }) => {
    const pathParts = [ genre ];
    if (parentSeries) {
      pathParts.push(parentSeries);
    }
    pathParts.push(programme);
    if (genre === 'Comedy' || seriesNumber > 1) {
      pathParts.push(`Series ${seriesNumber}`);
    }
    return pathParts.map(sanitise);
  };

  const sanitise = (path) => {
    const match = new RegExp(/[:*<>?\\/]/, 'g');
    const safePath = path.replace(match, "_");
    return safePath;
  }

  const sanitiseFilename = filename => {
    const sanitisedName = filename
      .replace(/_original\.m4a/, '.m4a');
    if (sanitiseFilename.length > 70) {
      throw new Error("Output filename is too long: " + sanitisedName);
    }
    return sanitisedName;
  }

  const createDirectory = (parts) => {
    const fullPath = readPath + parts.join('/');
    debug("Directory ", fullPath);
    mkdirp(fullPath, function(err) {
      debug(`Directory error creating ${parts}`, err);
    });
  }
};

module.exports = processFile;