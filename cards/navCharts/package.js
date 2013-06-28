Package.describe({
  "summary": "Card for navigator to explore maps and charts"
});

Package.on_use(function(api) {  
  api.use(['templating', 'flint-core', 'flint-ui']);
  
  api.add_files(['card.html', 'card.js'], 'client');
});
