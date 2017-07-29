var test = require ('blue-tape');
var albumRetag = require ('../../lib/retag/album-retag');
var objectAssign = require('object-assign');
var testData = require ('./test-data');

var initialData;
var rewrittenData;

test('Test album that is not rewritten', function (t) {
	initialData = objectAssign({}, testData, { album: 'Count Arthur Strong', genre: 'Comedy'});
	rewrittenData = albumRetag.rewrite(initialData);
	t.notEqual(rewrittenData, initialData, 'Should not return the same object as is passed in');
	t.equal(rewrittenData.album, 'Count Arthur Strong', 'Should not rewrite basic album names');
	t.equal(rewrittenData.artist, 'BBC Radio Comedy', 'Artist should be BBC Radio + genre');
	t.equal(rewrittenData.album_artist, 'BBC Radio Comedy', 'Album artist should be BBC Radio + genre');
	t.end();
});


test('Test long running serial: Book at Bedtime', function (t) {
	initialData = objectAssign({}, testData, { album: 'Book at Bedtime', genre: 'Drama'});
	rewrittenData = albumRetag.rewrite(initialData);
	t.equal(rewrittenData.artist, 'Book at Bedtime', 'Artist should be name of long-running serial');
	t.equal(rewrittenData.album_artist, 'BBC Radio Drama', 'Album artist should be BBC Radio + genre');
	t.equal(rewrittenData.album, initialData.title, 'Album should be title where not available from album');
	t.end();
});

test('Test long running serial: Classic Serial', function (t) {
	initialData = objectAssign({}, testData, { album: 'Classic Serial', genre: 'Drama'});
	rewrittenData = albumRetag.rewrite(initialData);
	t.equal(rewrittenData.artist, 'Classic Serial', 'Artist should be name of long-running serial');
	t.equal(rewrittenData.album_artist, 'BBC Radio Drama', 'Album artist should be BBC Radio + genre');
	t.end();
});

test('Test long running serial: Book of the Week', function (t) {
	initialData = objectAssign({}, testData, { album: 'Book of the Week: Spirals in Time: The Secret Life and Curious Afterlife of Seashells', genre: 'Factual'});
	rewrittenData = albumRetag.rewrite(initialData);
	t.equal(rewrittenData.artist, 'Book of the Week', 'Artist should be name of long-running serial');
	t.equal(rewrittenData.album_artist, 'BBC Radio Factual', 'Album artist should be BBC Radio + genre');
	t.equal(rewrittenData.album, 'Spirals in Time: The Secret Life and Curious Afterlife of Seashells');
	t.end();
});

test('Test series removed from album name', function (t) {
	initialData = objectAssign({}, testData, { album: 'Count Arthur Strong: Series 10'});
	rewrittenData = albumRetag.rewrite(initialData);
	t.equal(rewrittenData.album, 'Count Arthur Strong');
	t.equal(rewrittenData.disc, '10');
	t.end();
});


// Remove "Series: .*" from album name, and convert to disc number
// Remove "Episode: .*"  from album name, and convert to track number





