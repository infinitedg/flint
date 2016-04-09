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
			Flint.collection('viewscreeninputs').upsert({name:macroArgs.name},macroArgs);
		});
	Flint.registerMacro("removeVideoInput",
		"Removes a specific video input",
		{
			name: "The video id you want to set. This is what is used to identify and remove the video. Unique string",
			simulatorId: 'Obvious'
		}, function(macroArgs) {
			Flint.collection('viewscreeninputs').remove(macroArgs);
		});
	Flint.registerMacro("pauseVideoInput",
		"Removes a specific video input",
		{
			name: "The video id you want to pauseVideoInput. This is what is used to identify and remove the video. Unique string",
			simulatorId: 'Obvious'
		}, function(macroArgs) {
			//Change the viewscreen input template context to show that the video is paused.
			var template = Flint.collection('viewscreeninputs').findOne({name:macroArgs.name}).template;
			var context = template.context || {};
			context.paused = !context.paused;
			template.context = context;
			Flint.collection('viewscreeninputs').update({name:macroArgs.name},{$set:{template:template}});
		});
});
