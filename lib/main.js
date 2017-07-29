var fs = require ('fs');

var Main = function() {
    var filepath = 'C:/Users/dan/Desktop/iPlayer Recordings';
    return {
        temp : 'this is just a string',
        tomp: function() {
            return fs.readdirSync(filepath).join("\n");
        }
    }
}

module.exports = new Main();

