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

			if (Meteor.isServer) {
				// xxx @TODO Require separate logic for access permissions control
				_jobCollections[collectionName].allow({
					admin: function() {
						return true;
					}
				});

				_jobCollections[collectionName].startJobServer();
			}
		}
		return _jobCollections[collectionName];
	},
	processJobs: function(collectionName, jobType, options, worker) {
		var workerIdentifier = collectionName.toLowerCase() + '_' + jobType.toLowerCase();
		collectionName = collectionName.toLowerCase();
		options = options || {};
		Flint.Jobs.collection(collectionName); // Ensure the collection has been prepared

		_jobQueues[workerIdentifier] = Job.processJobs(collectionName, jobType, options, worker);
		return workerIdentifier;
	},
	queue: function(_id) {
		return _jobQueues[_id];
	},
	scheduleJob: function(collectionName, jobName, jobOpts, jobData) {
		return Flint.Jobs.createJob(collectionName, jobName, jobOpts, jobData).save();
	},
	createJob: function(collectionName, jobName, jobOpts, jobData) {
		jobOpts = jobOpts || {};
		jobData = jobData || {};

		jobOpts.cancelRepeats = jobOpts.cancelRepeats || false;

		var job = new Job(Flint.Jobs.collection(collectionName), jobName ,jobData);
		if (jobOpts.priority) {
			job.priority(jobOpts.priority);
		}
		if (jobOpts.retry) {
			job.retry(jobOpts.retry);
		}
		if (jobOpts.repeat) {
			job.repeat(jobOpts.repeat);
		}
		if (jobOpts.delay) {
			job.delay(jobOpts.delay);
		}
		if (jobOpts.after) {
			job.after(jobOpts.after);
		}
		if (jobOpts.depends) {
			job.depends(jobOpts.depends);
		}

		return job;
	},
	createWorker: function(collectionName, jobName, processOpts, worker) {
		processOpts = processOpts || {};
		Flint.Jobs.processJobs(collectionName, jobName, processOpts, worker);
	},
	createActor: function(jobName, interval, action) {
		// Find whether this actor is here
		if (Flint.Jobs.collection('generalQueue').find({type: jobName}).count() == 0) {
			Flint.Jobs.scheduleJob('generalQueue', jobName, {repeat: {wait: 60*1000}, cancelRepeats: true}, {});
			
			Flint.Jobs.createWorker('generalQueue', jobName, {}, function(job, cb) {
				// This job is never "done"
				var intervalFunction = function(){
					if (job.progress() === null) { // The server is shutting down
						// Be sure to fail the job so it can restart again
						job.fail({
							reason: 'Server shutting down - moving to a different host'
						});
						cb();
						return;
					} else if (job.progress() === false) { // The job is cancelled or paused
						job.fail({
							reason: 'Job no longer running on this host'
						});
						cb();
						return;
					} else {
						Meteor.setTimeout(intervalFunction, interval);
					}
					action();
				};
				intervalFunction();
			});
		}
	}
};

/* Potential improvements:
1. Create a collection that registers job queues globally by the workerIdentifier, which would become required
2. Use the options in that collection for initializing the worker
3. Setup an observer for each object in that collection to modify running workers according to those parameters

The above 3 points would make it possible to pause/resume work on-demand
*/

// Restart actors when needed
var restartCheckupInterval = 15;
Meteor.setInterval(function() {
	var t = new Date();
	t.setSeconds(t.getSeconds() - restartCheckupInterval); // We will filter for jobs not updated during our checkup interval
	// Get the list of running job IDs not updated since our last checkup interval and convert it to an array of IDs
	var jobs = _.map(Flint.Jobs.collection('generalQueue').find({status: 'running', updated: {$lt: t}}, {fields: {_id: 1}}).fetch(), function(doc) {
			return doc._id;
		});
	// Cancel said jobs
	Flint.Jobs.collection('generalQueue').cancelJobs(jobs);
	// Restart said jobs
	Flint.Jobs.collection('generalQueue').restartJobs(jobs);
}, restartCheckupInterval * 1000);