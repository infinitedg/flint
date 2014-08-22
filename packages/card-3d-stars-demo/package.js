Package.describe({
	summary: "Sample card",
	version: "0.1.0"
});

Package.on_use(function(api) {  
  api.use(['templating', 'flint']);
  
  api.add_files(['card.html'], 'client');
});
