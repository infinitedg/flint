Flint.collection('flintMacroDefinitions'); // Prepare the local virtual collection

Flint.macro = function(macroName, macroArguments) {
	// Get the server we'll run this on
	Meteor.call('nextServer', function(err, serverId) {
		if (!err) {
			var mid = Flint.collection('flintMacros').insert({
				serverId: serverId,
				macroName: macroName,
				args: macroArguments
			});
			Flint.Log.verbose("Macro " + mid + " scheduled", "flint-macro");
		} else {
			Flint.Log.error(err);
		}
	});
};

// To get a list of macros, Meteor.subscribe('flint_macro_engine.macroNames')
//		and look inside the flintMacroDefinitions collection