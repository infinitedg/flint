Package.describe({
	summary: 'Audio control macros',
	version: "0.1.0"
});

Package.on_use(function(api) {
	api.use(['flint', 'flint-macro-engine'],['server']);
	api.use(['templating', 'flint'],['client']);

	api.add_files(['card.html','card.js'],'client');
	api.add_files(['server.js'], ['server']);
});
