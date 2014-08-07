Package.describe({
  "summary": "Thruster screen.",
  version: "0.1.0"
});

Package.on_use(function(api) {  
  api.use(['templating', 'flint']);
  api.use(['three.js']);
  api.add_files(['core.html', 'core.js'], 'client');
  api.add_files(['card.html', 'card.js', 'thrusterStyle.css'], 'client');
    
});


        