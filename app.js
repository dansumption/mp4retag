var fs = require('fs');
var jsmediatags = require("jsmediatags");
 
// var path = "N:/Poetry/T_S_Eliot_Reads_Old_Possum_s_Book_of_Practical_Cats/";
var path = "N:/zzzTag/";

var handleItem = (filename) => {
  var item = path + filename;
  // console.log("Reading ", item);
  jsmediatags.read(item, {
    onSuccess: function(tag) {
      console.log(item, tag);
    },
    onError: function(error) {
      console.log(':(', error.type, error.info);
    }
  });
};
fs.readdir(path, function(err, items) {
    // console.log(items);
 
    for (var i=0; i<items.length; i++) {
        handleItem(items[i]);
    }
});
