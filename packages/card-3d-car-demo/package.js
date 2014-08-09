Package.describe({
	summary: "Sample 3D Card",
	version: "0.1.0"
});

Package.on_use(function(api) {  
  api.use(['templating', 'flint']);
  
  api.add_files(['card.html'], 'client');
});
