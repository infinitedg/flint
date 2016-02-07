Package.describe({
	name: "card-core-timeline",
	summary: "Core controls for handling the simulation timeline",
  version: "0.1.0",
  documentation: 'README.md'
});

Package.on_use(function(api) {
  api.use(['templating', 'flint']);

  api.add_files(['server.js'], 'server');

  api.add_files(['core.html',
								 'core.js',
								 'card.html',
								 'card.js'
								], 'client');
});
