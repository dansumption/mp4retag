


// Specify a directory

// Read all the mp3 files in that directory

// Load the file's MP3 tags
// Map genres: - genre-retag
// TODO: handle unexpected genres e.g. religion
// Album Artist = "BBC Radio" + genre.
// If not long-running serial (Book at Bedtime|Classic Serial|Book of the Week|Saturday Drama) then this is also the artist name
// If long running serial:
//  Artist is the serial name.
//  Album is either:
//      The title, if the existing album name is just the same as the serial name
//      Or the remainder if the album name is the serial name then ": ?(.*)$"
//      Or the title, minus anything after a colon.
// Remove "Series: .*" from album name, and convert to disc number
// Remove "Episode: .*"  from album name, and convert to track number
// Warn if no track number
// Backup MP3 file
// Write back to file:
//      title
//      artist
//      album artist
//      album
//      genre
//      track number
//      disc number if not 0





/* Original Python:

 """Rewrite Mp3 tags from get_iplayer"""
 # import stagger, os, re, shutil, argparse
 import eyed3, os, re, shutil, argparse
 # from stagger.id3 import *

 FILE_EXTENSION = re.compile("\\.mp3$", re.I)
 LONG_RUNNERS = r"Book at Bedtime|Classic Serial|Book of the Week|Saturday Drama"
 READINGS_DRAMAS = r"Book at Bedtime"
 READINGS_FACTUALS = r"Book of the Week"
 LONG_RUNNING = re.compile(LONG_RUNNERS, re.I)
 READINGS_DRAMA = re.compile(READINGS_DRAMAS, re.I)
 READINGS_FACTUAL = re.compile(READINGS_FACTUALS, re.I)
 PRE_COLON = re.compile("^(.*)\\:")
 PRE_SERIES = re.compile("^(.*)\\: Series (\\d+)$")
 PRE_EPISODE = re.compile("^(.*)\\: Episode (\\d+)$")

 def main():
 """MAIN"""
 parser = argparse.ArgumentParser()
 parser.add_argument("--write", action='store_true', help="write output tags")
 parser.add_argument('-v', "--verbose",  action='store_true')
 args = parser.parse_args()
 do_write = False
 all_genres = []
 if args.write:
 print("Will write results to tags")
 do_write = True


 mp3dir = os.listdir(".")
 for mp3file in mp3dir:
 if FILE_EXTENSION.search(mp3file):
 process_file(mp3file, do_write, all_genres, args.verbose)

 print("\n\n", "Genres: ", ", ".join(all_genres))

 def process_file(mp3file, write, all_genres, verbose):
 """Process an MP3 file"""

 # list files affected
 if verbose:
 print("\n")
 print(mp3file)

 # tag = stagger.read_tag(mp3file)
 tag = eyed3.load(mp3file).tag

 # set initial values
 title = tag.title
 artist = tag.artist
 album_artist = tag.album_artist
 album = tag.album
 # disc = tag.disc
 disc = tag.disc_num
 # genre = tag.genre
 genre = tag.genre.name
 # trackNo = tag.track
 trackNo = tag.track_num

 # Fix for genres
 if genre == "(57)":
 genre = "Comedy"
 elif genre == "Children's":
 genre = "Drama"
 elif genre == "Games & Quizzes":
 genre = "Comedy"
 elif genre == "Readings":
 if READINGS_DRAMA.match(tag.album):
 genre = "Drama"
 elif READINGS_FACTUAL.match(tag.album):
 genre = "Factual"
 else:
 print ("No match for readings genre in " + tag.album)

 if not (genre in all_genres):
 all_genres.append(genre)

 # Set album artist to genre categories
 album_artist = artist = "BBC Radio " + genre

 # For Classic Serial, Book at Bedtime etc. make this the artist name
 long_running_name = LONG_RUNNING.match(tag.album)
 if long_running_name:
 artist = long_running_name.group(0)
 undescriptiveAlbum = '^' + artist + '$'
 checkUndescriptiveAlbum = re.compile(undescriptiveAlbum)
 if checkUndescriptiveAlbum.match(album):
 album = title
 artistMatch = artist + ': ?(.*)$'
 strip_series = re.compile(artistMatch)
 remainder = strip_series.match(album)
 if remainder:
 album = remainder.group(1)
 else:
 # Assign the album name for Classic Serial etc.
 album = tag.title
 album_group = PRE_COLON.match(tag.title)
 if album_group is not None:
 album = album_group.group(1)

 else:
 # For multi-series programmes, remove Series from album name and
 # move to disc number.
 album_group = PRE_SERIES.match(tag.album)
 if album_group:
 album = album_group.group(1)
 disc = album_group.group(2)


 album_episode = PRE_EPISODE.match(album)
 if album_episode:
 album = album_episode.group(1)
 trackNo = album_episode.group(2)
 print("Splitting into album " + album + " and trackNo " + trackNo)

 if not (trackNo):
 print ("No Track number for: '" + mp3file + "'")

 if verbose:
 list_feature("Title", tag.title, title)
 list_feature("Artist", tag.artist, artist)
 list_feature("Album artist", tag.album_artist, album_artist)
 list_feature("Album", tag.album, album)
 # list_feature("Disc number", tag.disc, disc)
 list_feature("Disc number", tag.disc_num, disc)
 # list_feature("Track number", tag.track, trackNo)
 list_feature("Track number", tag.track_num, trackNo)

 # Write it all to the file
 if write:
 # backup the file
 if  not os.path.isfile("original_backup/" + mp3file):
 shutil.copy(mp3file, "original_backup/")
 tag.title = title
 tag.artist = artist
 tag.album_artist = album_artist
 tag.album = album
 tag.genre = genre
 # tag.track = trackNo
 tag.track_num = trackNo
 if disc != 0:
 # tag.disc = disc
 tag.disc_num = disc
 # tag.write()
 tag.save()

 def list_feature(name, original, new):
 """List a tag with original and replacement values"""
 describe = name + ": " + str(original)
 if original != new:
 describe += " --> " + str(new)
 print(describe)

 main()
 */