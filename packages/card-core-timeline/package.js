Package.describe({
	summary: "Core controls for handling the simulation timeline, including editor and moving",
  version: "0.1.0"
});

Package.on_use(function(api) {  
  api.use(['brentjanderson:kinetic', 'underscore', 'templating', 'flint']);

  api.add_files(['server.js'], 'server');
  
  api.add_files([
  		'styles.css',
	  	'card.html', 
	  	'card.js', 
	  	'core.html', 
	  	'core.js', 
	  	'editor.html',
	  	'editor.js',
	  	'editor_timeline.js'
  	], 'client');
});
