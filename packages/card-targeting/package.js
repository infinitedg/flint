Package.describe({
  "summary": "A targeting grid for gaining a target lock on enemy starships and other things to shoot at.",
  version: "0.1.0"
});

Package.on_use(function(api) {  
  api.use(['templating', 'flint', 'brentjanderson:kinetic']);
  
  api.add_files(['core.html', 'core.js'], 'client');
  api.add_files(['card.html', 'card.js', 'card.css'], 'client');
  api.add_files([
      'targeting-imgs/noTarget.png',
      'targeting-imgs/battlestar.png',
      'targeting-imgs/Cargo Ship.png',
      'targeting-imgs/Renegade.png',
      'targeting-imgs/Small Fighter.png',
      'targeting-imgs/notTargeting.png',
      'targeting-imgs/noImage.png'
  ], 'client');
});
