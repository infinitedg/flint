Package.describe({
	summary:'Flint lighting circuit system',
	version:'0.1.0',
});

Package.on_use(function(api) {
	api.use(['templating', 'less', 'flint', 'underscore', 'infinitedg:gsap',
	'keypress:keypress', 'twbs:bootstrap', 'ryanswapp:spectrum-colorpicker']);
	api.add_files(['card.html', 'moduleTemplate.html', 'card.less', 'flow.less',
		'client/app.js', 'client/canvas.js', 'client/footer.js',
		'client/moduleTemplates.js',
		'public/panelIcons/light.png', 'public/panelIcons/file.png',
		'public/panelIcons/hash.png', 'public/panelIcons/switch.png',
		'public/panelIcons/trigger.png', 'public/panelIcons/db.png'], 'client');
	api.add_files(['server/app.js', 'server/moduleTypes.js'], ['server']);
});
