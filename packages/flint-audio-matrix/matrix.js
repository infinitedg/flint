var _clientId = Math.floor(Math.random()*(Math.pow(2,32)+1)); // Random 32-bit unsigned integer

/**
*	matrix: Matrix object
*	parameters: key/value pairs mapping to specific parameters for the matrix to process
*/
function matrixPost(matrix, parameters) {
	if (Meteor.settings.audioMatrix && Meteor.settings.audioMatrix.debug) {
		Flint.Log.debug('PATCH', matrix.name, parameters, 'flint-audio-matrix');
	} else {
		HTTP.call('PATCH', matrix.url + '/datastore', {
			params: { json: JSON.stringify(parameters) },
			query: 'client=' + _clientId,
			headers: {
				'connection': 'keep-alive'
			}
		}, function(err, res) {
			if (err || res.statusCode < 200 || res.statusCode > 299) {
				Flint.Log.error('Error updating audio matrix: ' + matrix._id, parameters, err, res, "flint-audio-matrix");
			}
			// console.log(err, res);
		});
	}
}

function updateSend(doc) {
	var key = 'mix/chan/' + doc._mix.chan + '/matrix/' + doc._bus.type + '/' + doc._bus.chan + '/send';
	var data = {};
	data[key] = doc.volume * (doc.mute ? 0 : 1);
	matrixPost(doc._matrix, data);
}

// Send handling
Flint.collection('AudioMatrixSend').find({},{transform: function(doc) {
	// Merge in the mix and bus data
	doc._mix = Flint.collection('AudioMatrixMix').findOne(doc.mixId);
	doc._bus = Flint.collection('AudioMatrixBus').findOne(doc.busId);
	// @TODO replace _mix.matrixId below with doc.matrixId
	doc._matrix = Flint.collection('AudioMatrix').findOne(doc._mix.matrixId);
	return doc;
}}).observe({
	added: function(doc) {
		updateSend(doc);
	},
	changed: function(doc) {
		updateSend(doc);
	},
	removed: function(doc) {
		doc.mute = true; // Force removed intersections to mute immediately
		updateSend(doc);
	}
});

// Convert an object into a properly formatted paramters object for matrixPost
function prepareParameters(doc, validParameters, prefix) {
	prefix = prefix + '/%s';

	var parameters = _.pick(Flat(doc, {delimiter: '/'}), validParameters);
	// 3. Prefix parameters with /mix/chan/<index>/
	parameters = _.object( // Convert back into an object
		// 1. Convert parameters from object to 2-dimensional array
		_.map(_.pairs(parameters), function(pair) { 
			// 2. Replace "key" from array pair with prefixed version
			pair[0] = sprintf(prefix, pair[0]);
			return pair;
		})
	);

	return parameters;
}


function updateMix(doc) {
	// Create complete set of keys to post to MOTU for this mix
	var validParameters = ['eq/highshelf/enable',
		'eq/highshelf/mode',
		'eq/highshelf/freq',
		'eq/highshelf/gain',
		'eq/highshelf/bw',
		'eq/lowshelf/enable',
		'eq/lowshelf/mode',
		'eq/lowshelf/freq',
		'eq/lowshelf/gain',
		'eq/lowshelf/bw',
		'eq/mid1/enable',
		'eq/mid1/freq',
		'eq/mid1/gain',
		'eq/mid1/bw',
		'eq/mid2/enable',
		'eq/mid2/freq',
		'eq/mid2/gain',
		'eq/mid2/bw',
		'gate/enable',
		'comp/enable',
		'hpf/enable',
		'matrix/fader',
		'matrix/pan',
		'matrix/solo',
		'matrix/mute'];

	matrixPost(doc._matrix, prepareParameters(doc, validParameters, 'mix/chan/' + doc.chan));
};

Flint.collection('AudioMatrixMix').find({}, {transform: function(doc) {
	doc._matrix = Flint.collection('AudioMatrix').findOne(doc.matrixId);
	return doc
}}).observe({
	added: function(doc) {
		updateMix(doc);
	},
	changed: function(doc) {
		updateMix(doc);
	},
	removed: function(doc) {
		doc.matrix.fader = 0; // Turns off a given fader immediately
		updateMix(doc);
	}
});

function updateBus(doc) {
	// Create complete set of keys to post to MOTU for this mix
	var validParameters = ['eq/highshelf/enable',
		'eq/highshelf/mode',
		'eq/highshelf/freq',
		'eq/highshelf/gain',
		'eq/highshelf/bw',
		'eq/lowshelf/enable',
		'eq/lowshelf/mode',
		'eq/lowshelf/freq',
		'eq/lowshelf/gain',
		'eq/lowshelf/bw',
		'eq/mid1/enable',
		'eq/mid1/freq',
		'eq/mid1/gain',
		'eq/mid1/bw',
		'eq/mid2/enable',
		'eq/mid2/freq',
		'eq/mid2/gain',
		'eq/mid2/bw',
		'gate/enable',
		'comp/enable',
		'hpf/enable',
		'matrix/fader',
		'matrix/pan',
		'matrix/solo',
		'matrix/mute'];

	matrixPost(doc._matrix, prepareParameters(doc, validParameters, 'mix/' + doc.type + '/' + doc.chan));
};

Flint.collection('AudioMatrixBus').find({}, {transform: function(doc) {
	doc._matrix = Flint.collection('AudioMatrix').findOne(doc.matrixId);
	return doc
}}).observe({
	added: function(doc) {
		updateBus(doc);
	},
	changed: function(doc) {
		updateBus(doc);
	},
	removed: function(doc) {
		doc.matrix.fader = 0; // Turns off a given fader immediately
		updateBus(doc);
	}
});