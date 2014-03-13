Package.describe({
  "summary": "A targeting grid for gaining a target lock on enemy starships and other things to shoot at."
});

Package.on_use(function(api) {  
  api.use(['templating', 'flint', 'kinetic.js']);
  
  api.add_files(['core.html', 'core.js'], 'client');
  api.add_files(['card.html', 'card.js', 'card.css'], 'client');
  api.add_files([
      'targeting-imgs/noTarget.png',
      'targeting-imgs/battlestar.png',
      'targeting-imgs/Cargo Ship.png',
      'targeting-imgs/Renegade.png',
      'targeting-imgs/Small Fighter.png'
  ], 'client');
});
