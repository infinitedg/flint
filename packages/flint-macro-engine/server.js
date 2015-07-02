_flintMacros = {};

/**
Used to prepare a macro for use across the system. Requires macroName, macroDescription, and macroArguments
*/
Flint.registerMacro = function(macroName, macroDescription, macroArguments, macroFunc) {
	if (_flintMacros[macroName]) {
		Flint.Log.error("Macro " + macroName + " already registered!", "flint-macro-engine");
	} else {
		// If we don't have a description or arguments, throw an error
		if (typeof macroName !== 'string' || typeof macroDescription !== 'string' || typeof macroArguments !== 'object') {
			Flint.Log.error('Macro registration for ' + macroName + ' invalid: A macro must have a macroName, macroDescription (both strings), a macroArguments definition (object), and a macroFunc (function)', 'flint-macro-engine');
		} else {
			Flint.Log.info('Macro registered for ' + macroName);
			_flintMacros[macroName] = {
				name: macroName,
				arguments: macroArguments,
				description: macroDescription,
				func: macroFunc
			};
		}
	}
};
Meteor.startup(function(){
// The heart of the macro engine, used to execute a given macro
Flint.Jobs.createWorker('macroQueue', 'macro', {}, function(job, cb) {
	// Trigger macro
	if (!_flintMacros[job.data.macroName]) {
		job.fail("No such macro " + job.data.macroName);
		cb();
	} else {
		_flintMacros[job.data.macroName].func(job.data.args);
		job.done();
		cb();
	}
});

// Setup automatic macro triggering
Flint.Jobs.collection('macroQueue').find({ type: 'macro', status: 'ready'})
.observe({
	added: function() {
		Flint.Jobs.queue('macroQueue', 'macro').trigger();
	}
});


// Used to emergency transfer a macro if it is created on a server that doesn't exist
Flint.collection('flintMacros').find().observe({
	added: function(doc) {
		if (Flint.collection('flintServers').find({serverId: doc.serverId}).count() === 0) {
			Flint.Log.info("Moving macro " + doc._id + " to new server", 'flint-macro-engine');
			var serverId = Meteor.call('nextServer');
			Flint.collection('flintMacros').update({serverId: doc.serverId}, 
				{$set: {serverId: Meteor.call('nextServer')}}, {multi: true});
		}
	}
});
});
// Return a collection flintMacroDefintions that contains the names, descriptions, and arguments of all registered macros
Meteor.publish("flint_macro_engine.macroNames", function() {
	var self = this;
	_.each(_flintMacros, function(macroPayload, macroName) {
		self.added("flintMacroDefinitions".toLowerCase(), macroName, _.pick(macroPayload, ['name', 'arguments', 'description']));
	});

	self.ready();
});
