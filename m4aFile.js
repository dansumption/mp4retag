const _ = require('lodash');
const fs = require('fs');
const readTags = require('./readTags');
const mapTags = require('./mapTags');
const mkdirp = require('mkdirp');
const debug = require('./debug');
const ffmpeg = require('fluent-ffmpeg');

const pidRegexp = /(b[a-z0-9]+)_(original|shortened|podcast)\.m4a/;

let defaults;

const setDefaults = ({
    readDir,
    writeDir,
    completeDir,
    failDir
}) => {
    defaults = {
        readDir,
        writeDir,
        completeDir,
        failDir
    };
};

const processFile = filename => {
    let outputTags = {};
    const readFilePath = [defaults.readDir, filename].join('/');

    debug('Will read ' + readFilePath);

    const getTags = () => {
        return readTags(readFilePath).then(
            function (tags) {
                const genre = mapTags.mapGenre(tags);
                const artist = mapTags.mapArtist(genre);
                const { programme, seriesNumber, parentSeries } = mapTags.findProgrammeAndSeries(tags);
                const trackNumber = mapTags.findTrack(tags);
                const title = mapTags.findTitle(tags);
                if (!genre) {
                    throw new Error("NO GENRE FOR " + filename);
                }
                outputTags = {
                    genre,
                    artist,
                    album_artist: parentSeries || artist,
                    album: programme,
                    track: trackNumber,
                    disc: seriesNumber,
                    title
                };
            });
    };

    const getAndCreateWriteFilePath = () => {
        const pathParts = makePathParts(outputTags);
        const writeDir = [defaults.writeDir, ...pathParts].join('/');
        const writeFilename = getOutputFilename({ filename, ...outputTags });
        const writeFilePath = [writeDir, writeFilename].join('/');
        debug('Primse to make dir', writeFilePath);
        return new Promise(function (resolve, reject) {
            debug("Mkdirp", writeFilePath);
            mkdirp(writeDir, function (err) {
                if (err) {
                    reject(`Error creating directory ${writeDir}: ${err}`);
                }
                else {
                    debug("Resolving", writeFilePath);
                    resolve(writeFilePath);
                }
            });
        });
    };

    const retagFile = (writeFilePath) => {
        debug("Will write to file", writeFilePath);
        const flags = metadataForFFmpeg(outputTags);
        return new Promise(function (resolve, reject) {
            ffmpeg({ source: readFilePath, logger: { error: debug } })
                .outputOptions(flags)
                .on('error', function (err, stdout, stderr) {
                    reject(filename, 'An error occurred: ' + err.message, "STDOUT: " + stdout, "STDERR: " + stderr);
                })
                .on('end', function () {
                    resolve();
                })
                .saveToFile(writeFilePath);
        });
    };

    const makePathParts = ({ genre, artist, album_artist, album, disc }) => {
        const pathParts = [genre];
        if (album_artist !== artist) {
            pathParts.push(album_artist);
        }
        pathParts.push(album);
        if (genre === 'Comedy' || disc !== '1') {
            pathParts.push(`Series ${disc}`);
        }
        return pathParts.map(sanitisePath);
    };

    const sanitisePath = (path) => {
        const unsafeCharacters = new RegExp(/[:*<>?\\/ _]+/, 'g');
        const safePath = path.replace(unsafeCharacters, "_");
        return safePath;
    }

    const sanitiseParam = (param) => {
        return param.includes(' ') ?
            `${param} `
            : param;
        // .replace(/([" ])/g, '\\$1');
    }

    const metadataForFFmpeg = (tags) => {
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


    const getOutputFilename = ({ filename, track, title }) => {
        const pidResults = pidRegexp.exec(filename);
        if (!pidResults) {
            throw new Error("Cannot find pid in " + filename);
        }
        const pid = pidResults[1];
        const sanitisedTitle = sanitisePath(title.substr(0, 30));
        const trackNumber = track ? `${track}_` : '';
        const outputFilename = `${trackNumber}${sanitisedTitle}_${pid}.m4a`;
        return outputFilename;
    }

    return getTags()
        .then(getAndCreateWriteFilePath)
        .then(retagFile)
        .catch(function (error) {
            debug("FAILED", filename, error, "\n");
        }
        );
}

module.exports = { setDefaults, processFile };