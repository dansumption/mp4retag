var objectAssign = require('object-assign');

module.exports = {
	rewrite: function rewrite (initialData) {
		var rewrittenData = objectAssign({}, initialData);

		switch (rewrittenData.genre) {
			case '(57)':
			case 'Games & Quizzes':
				rewrittenData.genre = 'Comedy';
				break;
			case 'Children\'s':
				rewrittenData.genre = 'Drama';
				break;
			case 'Readings':
				switch (rewrittenData.album) {
					case 'Book of the Week':
						rewrittenData.genre = 'Factual';
						break;
					case 'Book at Bedtime':
						rewrittenData.genre = 'Drama';
						break;
					default :
						rewrittenData.genre = 'Drama';
						break;
				}
				break;
		}
		return rewrittenData;
	}
}