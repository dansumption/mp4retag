var objectAssign = require('object-assign');
var longRunningSerials = ['Book at Bedtime',
	'Classic Serial',
	'Book of the Week',
	'Saturday Drama'
];
var longRunningRegexp = new RegExp('^(' +
	longRunningSerials.join('|') +
	')(?:: (.*))?$');

var seriesAndEpisodeRegexp = new RegExp('^(.*): Series (\d+)$');

console.log (seriesAndEpisodeRegexp.exec('Count Arthu: Series 1'));

module.exports = {
	rewrite: function rewrite (initialData) {
		var rewrittenData = objectAssign({}, initialData);
		rewrittenData.artist = rewrittenData.album_artist = 'BBC Radio ' + rewrittenData.genre;

		var longRunningMatch = longRunningRegexp.exec(rewrittenData.album);
		if (longRunningMatch && longRunningMatch[1]) {
			rewrittenData.artist = longRunningMatch[1];
			if (longRunningMatch[2]) {
				rewrittenData.album = longRunningMatch[2];
			}
			else {
				rewrittenData.album = rewrittenData.title;
			}
		}

		var seriesAndEpisodeMatch = seriesAndEpisodeRegexp.exec(rewrittenData.album);
		console.log('TEST ' + rewrittenData.album + ' > MATCHES: ' + seriesAndEpisodeMatch);
		if (seriesAndEpisodeMatch && seriesAndEpisodeMatch[1]) {
			rewrittenData.album = seriesAndEpisodeMatch[1];
			if (seriesAndEpisodeMatch[2]) {
				rewrittenData.disc = seriesAndEpisodeMatch[2];
			}
		}

		return rewrittenData;
	}
};