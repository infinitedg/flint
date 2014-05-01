Package.describe({
});

Package.on_use(function(api) {  
  api.use(['templating', 'flint']);
  
  api.add_files(['core.html', 'core.js'], 'client');
  api.add_files(['card.html', 'card.js', 'card.css'], 'client');
    api.add_files(['models/att5.mtl', 'models/att5.obj', 'models/multimaterial.dae', 'models/ship.json'], 'client');
});
