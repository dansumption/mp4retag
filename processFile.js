const fs = require('fs');
var mkdirp = require('mkdirp');
const debug = require('./debug');
const readTags = require('./readTags');
const mapTags = require('./mapTags');
const pidRegexp = /(b[a-z0-9]+)_original\.m4a/;

const processFile = (readPath, writePath, filename) => {
  const filePath = [readPath, filename].join('/');
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
    const trackNumber = mapTags.findTrack(tags);
    const title = mapTags.findTitle(tags);
    if (!genre) {
      throw new Error("NO GENRE FOR " + filename);
    }
    const pathParts = makePathParts({  genre, parentSeries, programme, seriesNumber });
    const outputPath = [writePath, ...pathParts].join('/');
    const outputFilename = getOuputFilename({ filename, trackNumber, title });
    const outputFilenameWithPath = [outputPath, outputFilename].join('/');

    // createDirectory([genre, albumPath]);
    // TODO: re-enable file copy.
    // const input = fs.createReadStream(path + file);
    // const output = fs.createWriteStream(fullPath);
    // input.pipe(output);
    debug(
      filename,
      // `\tPROGRAMME ${programme}`, `\tSERIES ${seriesNumber} (${parentSeries})`, `\tTRACK ${trackNumber}`, `\tGENRE ${genre}`, `\tTITLE ${title}`,
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
    const match = new RegExp(/[:*<>?\\/ ]/, 'g');
    const safePath = path.replace(match, "_");
    return safePath;
  }

  const getOuputFilename = ({ filename, trackNumber, title }) => {
    const pidResults = pidRegexp.exec(filename);
    if (!pidResults) {
      throw new Error("Cannot find pid in " + filename);
    }
    const pid = pidResults[1];
    const sanitisedTitle = sanitise(title.substr(0, 30));
    const track = trackNumber ? trackNumber : '';
    const outputFilename = `${track}_${sanitisedTitle}_${pid}.m4a`;
    return outputFilename;
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