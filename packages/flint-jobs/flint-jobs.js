var _jobCollections = {},
	_jobQueues = {};

Flint.Jobs = {
	/**
	* Create or return cached copy of the corresponding job collection
	*/
	collection: function(collectionName, options) {
		collectionName = collectionName.toLowerCase();
		if (!_jobCollections[collectionName]) {
			options = options || {};
			_jobCollections[collectionName] = new JobCollection(collectionName, options);

			// xxx @TODO Require separate logic for this function
			_jobCollections[collectionName].allow({
				admin: function() {
					return true;
				}
			});

			_jobCollections[collectionName].startJobServer();
		}
		return _jobCollections[collectionName];
	},
	processJobs: function(collectionName, jobType, options, worker, workerIdentifier) {
		collectionName = collectionName.toLowerCase();
		options = options || {};
		Flint.Jobs.collection(collectionName); // Ensure the collection has been prepared

		_jobQueues[workerIdentifier] = Job.processJobs(collectionName, jobType, options, worker);
		return workerIdentifier;
	},
	queue: function(_id) {
		return _jobQueues[_id];
	}
};

/* Potential improvements:
1. Create a collection that registers job queues globally by the workerIdentifier, which would become required
2. Use the options in that collection for initializing the worker
3. Setup an observer for each object in that collection to modify running workers according to those parameters

The above 3 points would make it possible to pause/resume work on-demand
*/
