const genres = {
    "Comedy": "Comedy",
    "Games & Quizzes": "Comedy",
    "Drama": "Drama",
    "Readings": "Drama",
    "Factual": "Factual",
    "Music": "Music"
}

const parentSeries = [
    'Book at Bedtime',
	'Classic Serial',
	'Book of the Week',
	'Saturday Drama'
];

const programmeAndSeriesRegExp = /^(.*): Series (\d+)\w*$/;
const parentSeriesRegexp = new RegExp('^('
    + parentSeries.join('|')
    + ')(?:: (.*))?$');

const findAlbum = tags => {
    const taggedAlbum = tags['album'];
    return taggedAlbum;
  }
  
  const findTrack = tags => {
    const taggedTrack = tags['track'];
    return taggedTrack;
  }
  
  const findTitle = tags => {
    const taggedTitle = tags['title'];
    return taggedTitle;
  }
  
  const findGenre = tags => {
    const taggedGenre = tags['genre'];
    return taggedGenre;
  }

const mapGenre = tags => {
    const taggedGenre = findGenre(tags);
    const mappedGenre = genres[taggedGenre];
    if (!mappedGenre) {
        throw new Error("Unfound genre: " + taggedGenre);
    }
    return mappedGenre;
};

const findProgrammeAndSeries = tags => {


    const taggedAlbum = findAlbum(tags);

    let seriesName, seriesNumber;
    const seriesAndEpisodeMatch = programmeAndSeriesRegExp.exec(taggedAlbum);
    if (seriesAndEpisodeMatch) {
        seriesName = seriesAndEpisodeMatch[1];
        seriesNumber = seriesAndEpisodeMatch[2];
    } else {
        seriesName = taggedAlbum;
        // TODO - get series from existing tags
        seriesNumber = '1'; 
    }

    let parentSeries, programme, albumArtist;
    const parentSeriesMatch = parentSeriesRegexp.exec(seriesName);
    if (parentSeriesMatch) {
        parentSeries = parentSeriesMatch[1];
        programme = parentSeriesMatch[2] || findTitle(tags);
    } else {
        programme = seriesName;
    }

    return { programme, seriesNumber, parentSeries };
}

const mapArtist = genre => {
    return 'BBC Radio ' + genre;
}

module.exports = {
    mapGenre,
    mapArtist,
    findAlbum,
    findGenre,
    findTitle,
    findTrack,
    findProgrammeAndSeries
  };
