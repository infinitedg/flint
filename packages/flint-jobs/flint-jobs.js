var _jobCollections = {},
	_jobQueues = {};

Flint.Jobs = {
	/**
	* Create or return cached copy of the corresponding job collection
	*/
	collection: function(collectionName, options) {
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
	processJobs: function(collectionName, jobType, options, worker) {
		options = options || {};
		Flint.Jobs.collection(collectionName); // Ensure the collection has been prepared
		return Job.processJobs(collectionName, jobType, options, worker);
	}
};