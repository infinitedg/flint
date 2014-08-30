var _flintMacros = {};
Meteor.startup(function() {
	Flint.collection('flintMacros').find({serverId: Flint.serverId()}).observe({
		added: function(doc) {
			// Trigger macro
			if (!_flintMacros[doc.macroName]) {
				Flint.Log.error("No such macro " + doc.macroName);
			} else {
				Flint.Log.verbose("Triggering macro " + doc.macroName, "flint-macro-engine");
				_flintMacros[doc.macroName].apply({}, doc.args);
			}
			Flint.collection('flintMacros').remove(doc._id);
		}
	});

	Flint.collection('flintServers').find().observe({
		removed: function(doc) {
			// When a server drops, update all macros for that server to a new server
			Flint.Log.info("Moving macros from server " + doc.serverId + " to new server", 'flint-macro-engine');
			var serverId = Meteor.call('nextServer');
			Flint.collection('flintTweens').update({serverId: doc.serverId}, 
				{$set: {serverId: Meteor.call('nextServer')}}, {multi: true});
		}
	});

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

	Flint.registerMacro = function(macroName, macroFunc) {
		if (_flintMacros[macroName]) {
			Flint.Log.error("Macro " + macroName + " already registered!", "flint-macro-engine");
		} else {
			_flintMacros[macroName] = macroFunc;
		}
	};

	// Flint.registerMacro("testMacro", function(arg1, arg2, arg3) {
	// 	Flint.Log.info("TestMacro! ", arg1, arg2, arg3);
	// 	Flint.Log.info("Current number of servers: " + Flint.collection('flintServers').find({}).count());
	// });
});