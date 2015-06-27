Flint.collection('flintMacroDefinitions'); // Prepare the local virtual collection

Flint.macro = function(macroName, macroArguments) {
	// Schedule this macro for immediate execution by a macro worker
	Flint.Jobs.scheduleJob('macroQueue', 'macro', {}, {macroName: macroName, args: macroArguments});
};

// To get a list of macros, Meteor.subscribe('flint_macro_engine.macroNames')
//		and look inside the flintMacroDefinitions collection
