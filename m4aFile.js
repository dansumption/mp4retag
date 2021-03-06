const _ = require('lodash');
const fs = require('fs');
const readTags = require('./readTags');
const mapTags = require('./mapTags');
const debug = require('./debug');
const ffmpeg = require('fluent-ffmpeg');
const moveFile = require('./moveFile.js');
const makeDirectory = require('./makeDirectory');
const makePath = require('./makePath');
const pidRegexp = /([bp][a-z0-9]+)_(original|shortened|podcast|editorial|other|default)\.(m(4a|p3))/;

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
    const readFilePath = makePath([defaults.readDir, filename]);

    const getTags = () => {
        debug('get tags');
        return readTags(readFilePath).then(
            function (tags) {
                const genre = mapTags.mapGenre(tags);
                const artist = mapTags.mapArtist(genre);
                const { programme, seriesNumber, parentSeries } = mapTags.findProgrammeAndSeries(tags);
                const trackNumber = mapTags.findTrack(tags);
                const title = mapTags.findTitle(tags);
                if (!genre) {
                    throw new Error('NO GENRE FOR ' + filename);
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
        const writeDir = makePath([defaults.writeDir, ...pathParts]);
        const writeFilename = getOutputFilename({ filename, ...outputTags });
        const writeFilePath = makePath([writeDir, writeFilename]);
        return new Promise(function (resolve, reject) {
            debug('Make directory ' + makePath(pathParts));
            return makeDirectory(writeDir).then(function () {
                resolve(writeFilePath);
            });
        });
    };

    const retagFile = (writeFilePath) => {
        const flags = metadataForFFmpeg(outputTags);
        return new Promise(function (resolve, reject) {
            debug('Writing retagged file to ' + writeFilePath);
            ffmpeg({ source: readFilePath, logger: { error: debug } })
                .outputOptions(flags)
                .audioCodec('copy')
                .noVideo()
                .on('error', function (err, stdout, stderr) {
                    reject('An error occurred running ffmpeg: ' + err.message + '\nSTDOUT: ' + stdout + '\nSTDERR: ' + stderr);
                })
                .on('end', function (stdout, stderr) {
                    // debug(filename, 'Success.', 'STDOUT: ' + stdout, 'STDERR: ' + stderr);
                    resolve();
                })
                .saveToFile(writeFilePath);
        });
    };

    const moveSuccesfulFile = () => {
        const successPath = makePath([defaults.completeDir, filename]);
        debug('Move original to ' + successPath);
        // TODO - move directory making to defaults
        return new Promise(function (resolve, reject) {
            makeDirectory(defaults.completeDir).then(function () {
                moveFile(readFilePath, successPath);
                resolve();
            });
        });
    }

    // TODO - test
    const moveFailedFile = () => {
        const failPath = makePath([defaults.failDir, filename]);
        debug('Move original to ' + failPath);
        // TODO - move directory making to defaults
        return new Promise(function (resolve, reject) {
            makeDirectory(defaults.failDir).then(function () {
                moveFile(readFilePath, failPath);
                resolve();
            });
        });
    }


    const makePathParts = ({ genre, artist, album_artist, album, disc }) => {
        const pathParts = [genre, artist];
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
        const unsafeCharacters = new RegExp(/[:*<>?\\/_]+/, 'g');
        const safePath = path.replace(unsafeCharacters, '');
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
            throw new Error('Cannot find pid in ' + filename);
        }
        const pid = pidResults[1];
        const fileExtension = pidResults[3];
        const sanitisedTitle = sanitisePath(title.substr(0, 30));
        const trackNumber = track ? `${track} ` : '';
        const outputFilename = `${trackNumber}${sanitisedTitle} ${pid}.${fileExtension}`;
        return outputFilename;
    }

    debug();
    debug('Begin ' + readFilePath);

    return getTags()
        .then(getAndCreateWriteFilePath)
        .then(retagFile)
        .then(moveSuccesfulFile)
        .catch(function (error) {
            debug('FAILED', filename, error, '\n');
            moveFailedFile();
            return error;
        }
        );
}

module.exports = { setDefaults, processFile };