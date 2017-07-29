var fs = require('fs');
var jsmediatags = require("jsmediatags");
 
// var path = "N:/Poetry/T_S_Eliot_Reads_Old_Possum_s_Book_of_Practical_Cats/";
var path = "N:/zzzTag/temp/";

var readFile = (filename) => {
  var filePath = path + filename;
  // console.log("Reading ", item);
  jsmediatags.read(filePath, {
    onSuccess: function(tag) {
      // console.log(filePath, tag);
      processFile({file: filePath, tags: tag['tags']})
      // console.log(JSON.stringify(tag['tags']));
    },
    onError: function(error) {
      console.log(':(',filePath , error.type, error.info);
    }
  });
};

var logObject = (obj) => {
  for (var k in obj) {
    console.log(k);
  } 
}

var processFile = ({file, tags}) => {
  var genre = findGenre(tags);
  console.log("Processed ", file, genre);
};

var findGenre = (tags) => {
  return tags['genre'];
}

fs.readdir(path, function(err, items) {
    // console.log(items);
 
    for (var i=0; i<items.length; i++) {
        readFile(items[i]);
    }
});
