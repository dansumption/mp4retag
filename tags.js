const _ = require("lodash");
var ffmpeg = require('fluent-ffmpeg');
const debug = require('./debug');

const genres = {
  "Comedy" : "Comedy",
  "Games & Quizzes" : "Comedy",
  "Drama" : "Drama",
  "Readings" : "Drama",
  "Factual" : "Factual",
  "Music" : "Music"
}

const readTags = (filePath, {onSuccess, onError}) => {
  ffmpeg(filePath)
  .ffprobe(0, function(err, data) {
    if (_.get(data, 'format.tags')) {
      onSuccess(data.format.tags);
    }
    else {
      onError(err);
    }

  });
}

const findAlbum = (tags) => {
  const taggedAlbum = tags['album'];
  return taggedAlbum;
}

const findTrack = (tags) => {
  const taggedTrack = tags['track'];
  return taggedTrack;
}

const findTitle = (tags) => {
  const taggedTitle = tags['title'];
  return taggedTitle;
}

const findGenre = (tags) => {
  const taggedGenre = tags['genre'];
  debug("GENRE initialy", taggedGenre);
  if (!taggedGenre) {
    const match = /genre/;
    const searchTag = function(value, key, obj) {
      if (_.isNumber(key)) { return; }
      if (_.isString(key) && key.search(match) != -1) {
        debug("Found genre of ", value);
      }
      if (!_.isUndefined(value) && !_.isString(value)) {
        _.forEach(value, searchTag)
      }
    }
    _.forEach(tags, searchTag)
  }
  const mappedGenre = genres[taggedGenre];
  if (!mappedGenre && !_.isUndefined(taggedGenre)) {
    debug ("Unfound genre: ", taggedGenre);
  }
  return mappedGenre;
}

module.exports = {
  readTags,
  findAlbum,
  findGenre,
  findTitle,
  findTrack
};