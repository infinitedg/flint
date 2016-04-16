Meteor.startup(function(){
	Flint.registerMacro("addVideoInput",
		"Adds a specific video input",
		{
			name: "The video id you want to set. This is what is used to identify and remove the video. Unique string",
			weight: 'How important this input is. 0-1',
			priority: 'Primary or secondary input',
			template: 'Object. Includes template name key and context key (for template context)',
			viewscreenId: 'The id of the viewscreen in question',
			simulatorId: 'Obvious'
		}, function(macroArgs) {
			Flint.collection('viewscreeninputs').upsert({name:macroArgs.name,simulatorId:macroArgs.simulatorId,viewscreen:macroArgs.viewscreen},macroArgs);
		});
	Flint.registerMacro("removeVideoInput",
		"Removes a specific video input",
		{
			name: "The video id you want to set. This is what is used to identify and remove the video. Unique string",
			viewscreenId: 'The id of the viewscreen in question',
			simulatorId: 'Obvious'
		}, function(macroArgs) {
			Flint.collection('viewscreeninputs').remove(macroArgs);
		});
	Flint.registerMacro("pauseVideoInput",
		"Removes a specific video input",
		{
			name: "The video id you want to pauseVideoInput. This is what is used to identify and remove the video. Unique string",
			viewscreenId: 'The id of the viewscreen in question',
			simulatorId: 'Obvious'
		}, function(macroArgs) {
			//Change the viewscreen input template context to show that the video is paused.
			var template = Flint.collection('viewscreeninputs').findOne({name:macroArgs.name,simulatorId:macroArgs.simulatorId,viewscreen:macroArgs.viewscreen}).template;
			var context = template.context || {};
			context.paused = !context.paused;
			template.context = context;
			Flint.collection('viewscreeninputs').update({name:macroArgs.name,simulatorId:macroArgs.simulatorId,viewscreen:macroArgs.viewscreen},{$set:{template:template}});
		});
	Flint.registerMacro('removeAllVideoInput',
		'Removes every available video input',
		{
			viewscreenId: 'The id of the viewscreen in question',
			simulatorId: 'obvious'
		},function(macroArgs){
			if (macroArgs.viewscreen){
				Flint.collection('viewscreeninputs').remove(macroArgs);
			}
		}
		);
});
