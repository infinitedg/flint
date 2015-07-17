Package.describe({
	summary: 'Lighting control circuits',
	version: "0.2.0"
});

Package.on_use(function(api) {  

	api.use(['flint', 'templating', 'underscore', 'flint-jobs', 'twbs:bootstrap'],['server', 'client']);

	api.add_files(['server.js'], ['server']);
	api.add_files(['client.html', 'client.css', 'client.js'], ['client']);
	api.add_files(['compatability/dragging.js'], ['client']);
});
