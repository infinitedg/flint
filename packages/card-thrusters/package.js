Package.describe({
  "summary": "Thruster screen."
});

Package.on_use(function(api) {  
  api.use(['templating', 'flint']);
  api.use(['three.js']);
  api.add_files(['core.html', 'core.js'], 'client');
  api.add_files(['card.html', 'card.js', 'thrusterStyle.css'], 'client');
    
});


        