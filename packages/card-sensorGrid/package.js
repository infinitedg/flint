Package.describe({
  "summary": "Standard sensor grid card for sensors stations"
});

Package.on_use(function(api) {  
  api.use(['templating', 'flint', 'kinetic.js', 'underscore']);
  
  api.add_files(['publish.js'], 'server');
  api.add_files(['core.html', 'core.js', 'card.css'], 'client');
  api.add_files(['card.html', 'card.js'], 'client');
  api.add_files([
    'sprites/planet.png',
    'sprites/blackhole.png',
    'sprites/starbase.png'
  ], 'client');
});
