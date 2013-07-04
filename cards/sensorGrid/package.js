Package.describe({
  "summary": "Standard sensor grid card for sensors stations"
});

Package.on_use(function(api) {  
  api.use(['templating', 'flint-core', 'flint-ui']);
  
  api.add_files(['core.html', 'core.js'], 'client');
  api.add_files(['card.html', 'card.js'], 'client');
  api.add_files([
    'sprites/planet.png'
  ], 'client');
});
