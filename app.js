var fs = require('fs');
var mm = require('musicmetadata');
 
var path = "N:/Poetry/T_S_Eliot_Reads_Old_Possum_s_Book_of_Practical_Cats/";

var handleItem = (filename) => {
  var item = path + filename;
  console.log("Reading ", item);
  var stream = fs.createReadStream(item);
  var parser = mm(stream, function (err, metadata) {
  console.log("Data for " + item)
  if (err) {
    console.log (err);
  }
  console.log(metadata);
  stream.close();
});
}

fs.readdir(path, function(err, items) {
    // console.log(items);
 
    for (var i=0; i<items.length; i++) {
        handleItem(items[i]);
    }
});
