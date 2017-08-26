const fs = require('fs');
const jsmediatags = require("jsmediatags");
const _ = require("lodash");
var mkdirp = require('mkdirp');

const genres = {
  "Comedy" : "Comedy",
  "Games & Quizzes" : "Comedy",
  "Drama" : "Drama",
  "Readings" : "Drama",
  "Factual" : "Factual",
  "Music" : "Music"
}

// const path = "N:/Poetry/T_S_Eliot_Reads_Old_Possum_s_Book_of_Practical_Cats/";
const path = "N:/zzzTag/temp/";
// const path = "N:/zzzTag/";

const readFile = (filename) => {
  const filePath = path + filename;
  // console.log("Reading ", item);
  jsmediatags.read(filePath, {
    onSuccess: function(tag) {
      const tags = tag['tags'] || tag;
      // console.log(filePath, tag);
      processFile({file: filename, tags })
      // console.log(JSON.stringify(tag['tags']));
    },
    onError: function(error) {
      console.log(':(',filePath , error.type, error.info);
    }
  });
};

const logObject = (obj) => {
  for (const k in obj) {
    console.log(k);
  } 
}

const processFile = ({file, tags}) => {
  const genre = findGenre(tags);
  const album = findAlbum(tags);
  const track = findTrack(tags);
  const title = findTitle(tags);
  if (!genre) {
    // console.log(file, "no genre");
  }
  const albumPath = makeFriendlyPath(album);
  createDirectory([genre, albumPath]);
  const fullPath = path + [genre, albumPath].join('/') + '/' + file
  const input = fs.createReadStream(path + file);
  const output = fs.createWriteStream(fullPath);
  input.pipe(output);
  // console.log("Processed ", album, track, genre, title, file);
};

const makeFriendlyPath = (path) => {
  const match = new RegExp(/[:*<>?\\/]/, 'g');
  const safePath = path.replace(match, "_");
  return safePath;
}

const createDirectory = (parts) => {
  const fullPath = path + parts.join('/');
  console.log("Directory ", fullPath);
  mkdirp(fullPath, function(err) {
    console.log("Directory error ", err);
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
  if (!taggedGenre) {
    const match = /genre/;
    const searchTag = function(value, key, obj) {
      if (_.isNumber(key)) { return; }
      if (_.isString(key) && key.search(match) != -1) {
        console.log("Found genre of ", value);
      }
      if (!_.isUndefined(value) && !_.isString(value)) {
        _.forEach(value, searchTag)
      }
    }
    _.forEach(tags, searchTag)
  }
  const mappedGenre = genres[taggedGenre];
  if (!mappedGenre && !_.isUndefined(taggedGenre)) {
    console.log ("Unfound genre: ", taggedGenre);
  }
  return mappedGenre;
}

fs.readdir(path, function(err, items) {
    // console.log(items);
    _.forEach(items, function(item) {
        readFile(item);
    });
});
