var test = require ('blue-tape');
var genreRetag = require ('../../lib/retag/genre-retag');
var objectAssign = require('object-assign');
var testData = require ('./test-data');

var initialData;
var rewrittenData;


test('Test that a new object is returned with all the properties of the original', function (t) {
	initialData = objectAssign({}, testData);
	rewrittenData = genreRetag.rewrite(initialData);
	t.notEqual(rewrittenData, initialData, 'Should not return the same object as is passed in');
	t.deepEqual(rewrittenData, initialData, 'Should contain all the same properties as were passed in');
	t.end();
});

test('Test genre that is not rewritten', function (t) {
	initialData = objectAssign({}, testData, {genre: 'Comedy'});
	rewrittenData = genreRetag.rewrite(initialData);
	t.equal(rewrittenData.genre, 'Comedy', 'Comedy genre should be unmodified');
	t.end();
});

test('Test genre (57) is rewritten as Comedy', function (t) {
	initialData = objectAssign({}, testData, {genre: '(57)'});
	rewrittenData = genreRetag.rewrite(initialData);
	t.equal(rewrittenData.genre, 'Comedy', 'Comedy genre should be unmodified');
	t.end();
});

test('Test genre Games & Quizzes is rewritten as Comedy', function (t) {
	initialData = objectAssign({}, testData, {genre: 'Games & Quizzes'});
	rewrittenData = genreRetag.rewrite(initialData);
	t.equal(rewrittenData.genre, 'Comedy');
	t.end();
});

test('Test genre Children\'s is rewritten as Drama', function (t) {
	initialData = objectAssign({}, testData, {genre: 'Children\'s'});
	rewrittenData = genreRetag.rewrite(initialData);
	t.equal(rewrittenData.genre, 'Drama');
	t.end();
});

test('Test genre Readings is rewritten as Drama for Book at Bedtime', function (t) {
	initialData = objectAssign({}, testData, {genre: 'Readings', album: 'Book at Bedtime'});
	rewrittenData = genreRetag.rewrite(initialData);
	t.equal(rewrittenData.genre, 'Drama');
	t.end();
});


test('Test genre Readings is rewritten as Factual for Book of the Week', function (t) {
	initialData = objectAssign({}, testData, {genre: 'Readings', album: 'Book of the Week'});
	rewrittenData = genreRetag.rewrite(initialData);
	t.equal(rewrittenData.genre, 'Factual');
	t.end();
});

test('Test genre Readings is rewritten as Drama for arbitrary album titles', function (t) {
	initialData = objectAssign({}, testData, {genre: 'Readings', album: 'A.N. Other Programme'});
	rewrittenData = genreRetag.rewrite(initialData);
	t.equal(rewrittenData.genre, 'Drama');
	t.end();
});


