Flint.collection('flintMacroDefinitions'); // Prepare the local virtual collection

// 	createJob: function(collectionName, jobName, processOpts, jobOpts, jobData, worker) {

Flint.macro = function(macroName, macroArguments) {
	// Schedule this macro for execution by a macro worker
	Flint.Jobs.createJob('macroQueue', 'macro', {}, {}, {macroName: macroName, args: macroArguments});
};

// To get a list of macros, Meteor.subscribe('flint_macro_engine.macroNames')
//		and look inside the flintMacroDefinitions collection