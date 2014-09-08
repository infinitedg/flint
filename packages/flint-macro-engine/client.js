Flint.macro = function(macroName) {
	// Setup the arguments
	var args = Array.prototype.slice.call(arguments);
	args.shift(); // Trim the first argument, which is the macro name

	// Get the server we'll run this on
	Meteor.call('nextServer', function(err, serverId) {
		if (!err) {
			var mid = Flint.collection('flintMacros').insert({
				serverId: serverId,
				macroName: macroName,
				args: args
			});
			Flint.Log.verbose("Macro " + mid + " scheduled", "flint-macro");
		} else {
			Flint.Log.error(err);
		}
	});
};