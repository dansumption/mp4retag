const fs = require('fs');
const _ = require("lodash");
const processFile = require('./processFile');
const debug = require('./debug');

// const path = "N:/Poetry/T_S_Eliot_Reads_Old_Possum_s_Book_of_Practical_Cats/";
const path = "N:/zzzTag/temp/";
// const path = "N:/zzzTag/";
// const path = "C:/Users/dan/Desktop/iPlayer Recordings/temp/";

fs.readdir(path, function(err, items) {
    // debug(items);
    _.forEach(items, function(item) {
        // TODO: don't process directories
        // TODO: don't process non-mp4 files
        processFile(path, item);
    });
});
