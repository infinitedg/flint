function registerModuleType(name, options){
	var defaults = {
		category:'function',
		color:'rgb(137, 191, 114)',
		icon:'arrow-in',
		label:'module',
		inputs:0,
		outputs:0,
		arguments:{},
		parents:[],
	};
	defaults.name = name;
	defaults.category = options.category || defaults.category;
	defaults.color = options.color || defaults.color;
	defaults.icon = options.icon || defaults.icon;
	defaults.label = options.label || defaults.label;
	defaults.inputs = options.inputs || defaults.inputs;
	defaults.outputs = options.outputs || defaults.outputs;
	defaults.defaults = options.arguments || defaults.arguments;
	defaults.parents = options.parents || defaults.parents;
	moduleTypes.push(defaults);
}

Meteor.startup(function(){
	registerModuleType('channel', {
		category:'output',
		color:'rgb(191, 114, 133)',
		inputs:1,
		outputs:0,
		label:'Channel',
		icon:'light',
		arguments:{
			channel:null,
		},
	});
	registerModuleType('comment', {
		category:'other',
		color:'rgb(230, 230, 230)',
		inputs:0,
		outputs:0,
		label:'Comment',
		icon:'file',
		arguments:{
			title:'',
			body:'',
		},
	});
	registerModuleType('value', {
		category:'input',
		color:'rgb(134, 114, 191)',
		inputs:0,
		outputs:1,
		label:'Value',
		icon:'hash',
		arguments:{
			value:0,
		},
	});
	registerModuleType('conditional', {
		category:'function',
		color:'rgb(191, 173, 114)',
		inputs:2,
		outputs:1,
		label:'Conditional',
		icon:'switch',
		arguments:{
			type:'=', // Possibilities: =, !=, >, <, ≥, ≤
		},
	});
	registerModuleType('operation', {
		category:'function',
		color:'rgb(137, 191, 114)',
		inputs:255,
		outputs:1,
		label:'Operation',
		icon:'swap',
		arguments:{
			type:'+', // Possibilities: +, *
		},
	});
	registerModuleType('min', {
		category:'function',
		color:'rgb(137, 191, 156)',
		inputs:255,
		outputs:1,
		label:'Min',
		icon:'trigger',
	});
	registerModuleType('max', {
		category:'function',
		color:'rgb(137, 156, 191)',
		inputs:255,
		outputs:1,
		label:'Max',
		icon:'trigger',
	});
	registerModuleType('collection', {
		category:'input',
		color:'rgb(191, 124, 114)',
		inputs:0,
		outputs:1,
		label:'Collection',
		icon:'db',
	});
});