Meteor.startup(function(){
	Flint.registerMacro("addVideoInput",
		"Adds a specific video input",
		{
			name: "The video id you want to set. This is what is used to identify and remove the video. Unique string",
			weight: 'How important this input is. 0-1',
			priority: 'Primary or secondary input',
			template: 'Object. Includes template name key and context key (for template context)',
			simulatorId: 'Obvious'
		}, function(macroArgs) {
			Flint.collection('viewscreeninputs').insert(macroArgs);
		});
	Flint.registerMacro("removeVideoInput",
		"Removes a specific video input",
		{
			name: "The video id you want to set. This is what is used to identify and remove the video. Unique string",
			simulatorId: 'Obvious'
		}, function(macroArgs) {
			Flint.collection('viewscreeninputs').remove(macroArgs);
		});
});
