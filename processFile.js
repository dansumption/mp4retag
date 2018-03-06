const _ = require('lodash');
const fs = require('fs');
const mkdirp = require('mkdirp');
const debug = require('./debug');
const readTags = require('./readTags');
const mapTags = require('./mapTags');
const ffmpeg = require('fluent-ffmpeg');

const pidRegexp = /(b[a-z0-9]+)_(original|shortened|podcast)\.m4a/;

const processFile = (readPath, writePath, failPath, filename) => {
  const filePath = [readPath, filename].join('/');
  const onFail = errorMessage => {
    debug("FAILED", filename, errorMessage, "\n");
    // TODO : create fail path & add on error callback handler as 3rd parameter
    // fs.copyFile([readPath, filename].join('/'), [failPath, filename].join('/'));
  };
  readTags(filePath, {
    onSuccess: function (tags) {
      try {
        moveFile({ filename, readPath, writePath, tags })
      }
      catch (error) {
        onFail(error);
      }
    },
    onError: onFail
  });
};

const moveFile = ({ filename, tags, readPath, writePath }) => {
  const genre = mapTags.mapGenre(tags);
  const artist = mapTags.mapArtist(genre);
  const { programme, seriesNumber, parentSeries } = mapTags.findProgrammeAndSeries(tags);
  const trackNumber = mapTags.findTrack(tags);
  const title = mapTags.findTitle(tags);
  if (!genre) {
    throw new Error("NO GENRE FOR " + filename);
  }
  const pathParts = makePathParts({ genre, parentSeries, programme, seriesNumber });
  const outputPath = [writePath, ...pathParts].join('/');
  const outputFilename = getOuputFilename({ filename, trackNumber, title });
  const outputFilenameWithPath = [outputPath, outputFilename].join('/');
  const inputFilenameWithPath = [readPath, filename].join('/');

  mkdirp(outputPath, function (err) {
    if (err) {
      throw new Error(`Error creating directory ${outputPath}: ${err}`);
    }
    else {
      // TODO - album artist different for long-running?
      const outputTags = {
        genre,
        artist,
        album_artist: artist,
        album: programme,
        track: trackNumber,
        disc: seriesNumber,
        title
      };

      const flags = metadata(outputTags);
      ffmpeg({ source: inputFilenameWithPath, logger: { error: debug } })
        .outputOptions(flags)
        .on('error', function (err, stdout, stderr) {
          debug(filename, 'An error occurred: ' + err.message, "STDOUT: " + stdout, "STDERR: " + stderr);
        })
        .on('end', function () {
          // debug(filename, 'Processing finished !');
        })
        .saveToFile(outputFilenameWithPath);
    }
  });
};

const makePathParts = ({ genre, parentSeries, programme, seriesNumber }) => {
  const pathParts = [genre];
  if (parentSeries) {
    pathParts.push(parentSeries);
  }
  pathParts.push(programme);
  if (genre === 'Comedy' || seriesNumber !== '1') {
    pathParts.push(`Series ${seriesNumber}`);
  }
  return pathParts.map(sanitisePath);
};

const sanitisePath = (path) => {
  const match = new RegExp(/[:*<>?\\/ ]/, 'g');
  const safePath = path.replace(match, "_");
  return safePath;
}

const sanitiseParam = (param) => {
  return param.includes(' ') ?
    `${param} `
    : param;
  // .replace(/([" ])/g, '\\$1');
}

const metadata = (tags) => {
  return _.flatMap(
    _.filter(
      _.toPairs(tags),
      value => {
        return value[1]
      }),
    (value) => {
      return ['-metadata', `${value[0]}=${sanitiseParam(value[1])}`];
    });
};


const getOuputFilename = ({ filename, trackNumber, title }) => {
  const pidResults = pidRegexp.exec(filename);
  if (!pidResults) {
    throw new Error("Cannot find pid in " + filename);
  }
  const pid = pidResults[1];
  const sanitisedTitle = sanitisePath(title.substr(0, 30));
  const track = trackNumber ? trackNumber : '';
  const outputFilename = `${track}_${sanitisedTitle}_${pid}.m4a`;
  return outputFilename;
}

module.exports = processFile;