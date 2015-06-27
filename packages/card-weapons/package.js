Package.describe({
  "summary": "A targeting grid for gaining a target lock on enemy starships and other things to shoot at.",
  version: "0.1.0"
});

Package.on_use(function(api) {  
  api.use(['templating', 'flint', 'infinitedg:three']);
  
  api.add_files(['card.html', 'card.js', 'card.css'], 'client');
  api.add_files(['core.html', 'core.js'],'client');
  api.add_files(['crosshair.png'],'client');

  api.add_files(['publish.js'],'server');
});


