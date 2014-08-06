Package.describe({
	summary: "Card for rendering core widgets"
});

Package.on_use(function(api) {  
  api.use(['templating', 'flint']);
  
  api.add_files(['card.html', 'card.js','core.css'], 'client');
});
