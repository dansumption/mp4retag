const genres = {
    "Comedy": "Comedy",
    "Games & Quizzes": "Comedy",
    "Drama": "Drama",
    "Readings": "Drama",
    "Factual": "Factual",
    "Music": "Music"
}

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
        debug("Unfound genre: ", taggedGenre);
    }
    return mappedGenre;
};

module.exports = {
    mapGenre,
    findAlbum,
    findGenre,
    findTitle,
    findTrack
  };
