Package.describe({
});

Package.on_use(function(api) {  
  api.use(['templating', 'flint']);
  
  api.add_files(['core.html', 'core.js'], 'client');
  api.add_files(['card.html', 'card.js', 'card.css'], 'client');
    api.add_files(['models/battleship.mtl', 'models/battleship.obj','models/astra_elements2_c.png', 'models/multimaterial.dae', 'models/ship.json', 'models/battleship.json'], 'client');
});
