Package.describe({
	summary: 'Sound playback macros',
	version: "0.1.0"
});

Package.on_use(function(api) {
	api.use(['flint', 'flint-macro-engine', 'flint-audio-pedals', 'flint-sound'],['server']);
	api.use(['templating', 'flint'],['client']);

	api.add_files(['card.html','card.js','card.css'],'client');
	api.add_files(['server.js'], ['server']);
});
